/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {inject} from '../common/di';
import {PackageCodeLens} from '../models/packageCodeLens';
import {AbstractCodeLensProvider} from './abstractCodeLensProvider';
import {PackageCodeLensList} from '../lists/packageCodeLensList'

// TODO retrieve multiple sources from nuget.config
const FEED_URL = 'https://api.nuget.org/v3-flatcontainer';

@inject('jsonParser', 'httpRequest')
export class DotNetCodeLensProvider extends AbstractCodeLensProvider {

  constructor(config) {
    super(config);
    this.packageDependencyKeys = [
      'dependencies'
    ];
  }

  get selector() {
    return {
      language: 'json',
      scheme: 'file',
      pattern: '**/project.json'
    }
  };

  provideCodeLenses(document, token) {
    const jsonDoc = this.jsonParser.parse(document.getText());
    if (jsonDoc === null || jsonDoc.root === null)
      return [];

    if (jsonDoc.validationResult.errors.length > 0)
      return [];

    const collector = new PackageCodeLensList(document);
    this.enumerateAllEntries_(jsonDoc.root, collector);

    return collector.list;
  }

  resolveCodeLens(codeLensItem, token) {
    if (codeLensItem instanceof PackageCodeLens) {

      if (codeLensItem.packageVersion === 'latest') {
        super.makeLatestCommand(codeLensItem);
        return;
      }

      const queryUrl = `${FEED_URL}/${codeLensItem.packageName}/index.json`;
      return this.httpRequest.xhr({ url: queryUrl })
        .then(response => {
          if (response.status != 200)
            return super.makeErrorCommand(
              response.status,
              response.responseText,
              codeLensItem
            );

          const pkg = JSON.parse(response.responseText);
          const serverVersion = pkg.versions[pkg.versions.length - 1];
          if (!serverVersion)
            return super.makeErrorCommand(
              -1,
              "Invalid object returned from server",
              codeLensItem
            );

          return super.makeVersionCommand(
            codeLensItem.packageVersion,
            serverVersion,
            codeLensItem
          );

        }, errResponse => {
          return super.makeErrorCommand(
            errResponse.status,
            queryUrl,
            codeLensItem
          );
        });
    }
  }

  enumerateAllEntries_(node, collector) {
    const childNodes = node.getChildNodes();
    childNodes.forEach(childNode => {
      if (this.packageDependencyKeys.indexOf(childNode.key.value) !== -1)
        //this.parseDependencies_(childNode.value.getChildNodes(), collector);
        collector.addRange(childNode.value.getChildNodes());
      else if (childNode.value.type === 'object')
        this.enumerateAllEntries_(childNode.value, collector);
    });
  }

  createRequestUrl_(baseUrl, packageId) {
    return `${baseUrl}/${packageId}/index.json`;
  }

  extractVersionFromXml_(xmlResponse) {
    const versionExp = /<d:Version>(.*)<\/d:Version>/;
    const results = xmlResponse.match(versionExp);
    return results && results.length > 1 ? results[1] : '';
  }

  getPackageSources_() {
    return [''];
  }

}