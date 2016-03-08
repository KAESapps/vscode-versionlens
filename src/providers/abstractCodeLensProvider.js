/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {resolve} from '../common/di';

export abstract class AbstractCodeLensProvider {

  constructor(appConfig) {
    if (!appConfig) {
      throw new ReferenceError("AbstractCodeLensProvider was given an invalid reference to appConfig.")
    }
    this._disposables = [];
    this.appConfig = appConfig;
  }

  dispose() {
    while (this._disposables.length > 0) {
      this._disposables.pop().dispose();
    }
  }

  makeErrorCommand(statusCode, errorMsg, codeLensItem) {
    codeLensItem.command = {
      title: `Error ${statusCode}. ${errorMsg}`,
      command: undefined,
      arguments: undefined
    };
    return codeLensItem;
  }

  makeVersionCommand(currentVersion, checkVersion, codeLensItem) {
    if (checkVersion !== currentVersion
      && (resolve.semver.gt(checkVersion, currentVersion) === true || resolve.semver.lt(checkVersion, currentVersion) === true)) {
      codeLensItem.command = {
        title: `&uarr; ${this.appConfig.versionPrefix}${checkVersion}`,
        command: `_${this.appConfig.extentionName}.updateDependencyCommand`,
        arguments: [
          codeLensItem,
          `"${this.appConfig.versionPrefix}${checkVersion}"`
        ]
      };
    } else {
      this.makeLatestCommand(codeLensItem);
    }
    return codeLensItem;
  }

  makeLatestCommand(codeLensItem) {
    codeLensItem.command = {
      title: 'latest',
      command: undefined,
      arguments: undefined
    };
    return codeLensItem;
  }

  makeUpdateDependenciesCommand(codeLensItem) {
    codeLensItem.command = {
      title: '&uarr; Update all',
      command: `_${this.appConfig.extentionName}.updateDependenciesCommand`,
      arguments: []
    };
    return codeLensItem;
  }

}