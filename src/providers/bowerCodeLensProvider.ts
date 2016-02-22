/* --------------------------------------------------------------------------------------------
 * Copyright (c) Peter Flannery. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import {
CodeLensProvider,
CancellationToken,
CodeLens,
TextDocument
} from 'vscode';

import {JsonService} from '../services/jsonService'
import {PackageCodeLens} from '../models/packageCodeLens';
import {AppConfiguration} from '../models/appConfiguration';
import {AbstractCodeLensProvider} from './abstractCodeLensProvider';
import {PackageCodeLensList} from '../lists/packageCodeLensList'

export class BowerCodeLensProvider extends AbstractCodeLensProvider implements CodeLensProvider {

  private packageDependencyKeys: string[] = ['dependencies', 'devDependencies'];
  private bowerService;

  constructor(appConfig: AppConfiguration, jsonService: JsonService, bowerService) {
    super(appConfig, jsonService);
    if (!bowerService) {
      throw new ReferenceError("BowerCodeLensProvider is missing a reference to bower.")
    }
    this.bowerService = bowerService;
  }

  provideCodeLenses(document, token: CancellationToken) {
    const jsonDoc = this.jsonService.parseJson(document.getText());
    const collector: PackageCodeLensList = new PackageCodeLensList(document);

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

  resolveCodeLens(codeLensItem: CodeLens, token: CancellationToken): Thenable<CodeLens> {
    if (codeLensItem instanceof PackageCodeLens) {
      if (codeLensItem.packageVersion === 'latest') {
        super.makeLatestCommand(codeLensItem);
        return;
      }

      return new Promise<CodeLens>((success) => {
        this.bowerService.commands.info(codeLensItem.packageName)
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