/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {resolve} from '../common/di';
import {PackageCodeLens} from '../models/packageCodeLens';
import {AbstractCodeLensProvider} from './abstractCodeLensProvider';
import {PackageCodeLensList} from '../lists/packageCodeLensList'

export class NpmCodeLensProvider extends AbstractCodeLensProvider {

  constructor(config) {
    super(config);
    this.packageDependencyKeys = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  }

  provideCodeLenses(document, token) {
    const jsonDoc = resolve.jsonParser.parse(document.getText());
    const collector = new PackageCodeLensList(document);

    if (jsonDoc === null || jsonDoc.root === null)
      return [];

    if (jsonDoc.validationResult.errors.length > 0)
      return [];

    jsonDoc.root.getChildNodes().forEach((node) => {
      if (this.packageDependencyKeys.indexOf(node.key.value) !== -1) {
        collector.addRange(node.value.getChildNodes());
      }
    });

    return collector.list;
  }

  resolveCodeLens(codeLensItem, token) {
    if (codeLensItem instanceof PackageCodeLens) {

      // if (codeLensItem.parent === true) {
      //   super.makeUpdateDependenciesCommand(codeLensItem);
      //   return;
      // }

      if (codeLensItem.packageVersion === 'latest') {
        super.makeLatestCommand(codeLensItem);
        return;
      }

      const queryUrl = `http://registry.npmjs.org/${encodeURIComponent(codeLensItem.packageName)}/latest`;
      return resolve.httpRequest.xhr.createHttpRequest(queryUrl)
        .then(response => {
          if (response.status != 200) {
            return super.makeErrorCommand(response.status, response.responseText, codeLensItem);
          }

          const serverObj = JSON.parse(response.responseText);
          if (!serverObj || !serverObj.version) {
            return super.makeErrorCommand(-1, "Invalid object returned from server", codeLensItem);
          }

          return super.makeVersionCommand(codeLensItem.packageVersion, serverObj.version, codeLensItem);
        }, response => {
          const respObj = JSON.parse(response.responseText);
          return super.makeErrorCommand(response.status, respObj.error, codeLensItem);
        });
    }
  }
}