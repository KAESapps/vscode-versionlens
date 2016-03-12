/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {InstantiateMixin} from '../common/di';
import {PackageCodeLens} from '../models/packageCodeLens';
import {AbstractCodeLensProvider} from './abstractCodeLensProvider';
import {PackageCodeLensList} from '../lists/packageCodeLensList'

export class BowerCodeLensProvider
  extends InstantiateMixin(['jsonParser', 'bower'], AbstractCodeLensProvider) {

  constructor(appConfig) {
    super(appConfig);
    this.packageDependencyKeys = ['dependencies', 'devDependencies'];
  }

  provideCodeLenses(document, token) {
    const jsonDoc = super.jsonParser.parse(document.getText());
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
        super.makeLatestCommand(codeLensItem);
        return;
      }
      return new Promise(success => {
        super.bower.commands.info(codeLensItem.packageName)
          .on('end', (info) => {
            if (!info || !info.latest) {
              success(super.makeErrorCommand(-1, "Invalid object returned from server", codeLensItem));
              return;
            }
            success(super.makeVersionCommand(codeLensItem.packageVersion, info.latest.version, codeLensItem));
          })
          .on('error', (err) => {
            success(super.makeErrorCommand(-1, err.message, codeLensItem));
          });
      });
    }
  }

}