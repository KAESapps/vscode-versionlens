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

import {JsonService, IXHRResponse} from '../services/jsonService';
import {PackageCodeLens} from '../models/packageCodeLens';
import {AppConfiguration} from '../models/appConfiguration';
import {AbstractCodeLensProvider} from './abstractCodeLensProvider';
import {PackageCodeLensList} from '../lists/packageCodeLensList'

export class NpmCodeLensProvider extends AbstractCodeLensProvider implements CodeLensProvider {

  private packageDependencyKeys: string[] = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

  constructor(config: AppConfiguration, jsonService: JsonService) {
    super(config, jsonService);
  }

  provideCodeLenses(document, token: CancellationToken) {
    const jsonDoc = this.jsonService.parseJson(document.getText());
    const collector: PackageCodeLensList = new PackageCodeLensList(document);

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

  resolveCodeLens(codeLensItem: CodeLens, token: CancellationToken): Thenable<CodeLens> {
    if (codeLensItem instanceof PackageCodeLens) {

      if (codeLensItem.parent === true) {
        this.makeUpdateDependenciesCommand(codeLensItem);
        return;
      }

      if (codeLensItem.packageVersion === 'latest') {
        this.makeLatestCommand(codeLensItem);
        return;
      }

      const queryUrl = `http://registry.npmjs.org/${encodeURIComponent(codeLensItem.packageName)}/latest`;
      return this.jsonService.createHttpRequest(queryUrl)
        .then((response: IXHRResponse) => {
          if (response.status != 200) {
            return this.makeErrorCommand(response.status, response.responseText, codeLensItem);
          }

          const serverObj = JSON.parse(response.responseText);
          if (!serverObj || !serverObj.version) {
            return this.makeErrorCommand(-1, "Invalid object returned from server", codeLensItem);
          }

          return this.makeVersionCommand(codeLensItem.packageVersion, serverObj.version, codeLensItem);
        }, (response: IXHRResponse) => {
          const respObj = JSON.parse(response.responseText);
          return this.makeErrorCommand(response.status, respObj.error, codeLensItem);
        });
    }
  }
}