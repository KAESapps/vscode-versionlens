/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {inject} from '../common/di';
import {PackageCodeLens} from '../models/packageCodeLens';
import {AbstractCodeLensProvider} from './abstractCodeLensProvider';
import {PackageCodeLensList} from '../lists/packageCodeLensList'

@inject('jsonParser', 'bower')
export class BowerCodeLensProvider extends AbstractCodeLensProvider {

  constructor(
    appConfig
  ) {
    super(appConfig);
    this.packageDependencyKeys = ['dependencies', 'devDependencies'];
  }

  get selector() {
    return {
      language: 'json',
      scheme: 'file',
      pattern: '**/bower.json'
    }
  };

  provideCodeLenses(document, token) {
    const jsonDoc = this.jsonParser.parse(document.getText());
    const collector = new PackageCodeLensList(document);

    if (jsonDoc === null || jsonDoc.root === null)
      return [];

    if (jsonDoc.validationResult.errors.length > 0)
      return [];

    jsonDoc.root.getChildNodes().forEach((node) => {
      if (this.packageDependencyKeys.indexOf(node.key.value) !== -1)
        collector.addRange(node.value.getChildNodes());
    });

    return collector.list;
  }

  resolveCodeLens(codeLensItem, token) {
    if (codeLensItem instanceof PackageCodeLens) {
      if (codeLensItem.packageVersion === 'latest') {
        this.makeLatestCommand(codeLensItem);
        return;
      }
      return new Promise(success => {
        this.bower.commands.info(codeLensItem.packageName)
          .on('end', (info) => {
            if (!info || !info.latest) {
              success(this.makeErrorCommand(-1, "Invalid object returned from server", codeLensItem));
              return;
            }
            success(this.makeVersionCommand(codeLensItem.packageVersion, info.latest.version, codeLensItem));
          })
          .on('error', (err) => {
            success(this.makeErrorCommand(-1, err.message, codeLensItem));
          });
      });
    }
  }

}