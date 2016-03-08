/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {resolve} from '../common/di';
import {assertInstanceOf} from '../common/typeAssertion';
import {AppConfiguration} from '../models/appConfiguration';

export abstract class AbstractCodeLensProvider {

  constructor(appConfig) {
    assertInstanceOf(
      appConfig,
      AppConfiguration,
      "AbstractCodeLensProvider: appConfig parameter is invalid"
    );
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

  makeVersionCommand(currentVersion, serverVersion, codeLensItem) {
    const satisfied = resolve.semver.satisfies(serverVersion, currentVersion);
    const hasNewerVersion = resolve.semver.gtr(serverVersion, currentVersion) === true
      || resolve.semver.ltr(serverVersion, currentVersion) === true;

    if (this.appConfig.satisfyOnly && satisfied)
      return this.makeSatisfiedCommand(codeLensItem);
    else if (serverVersion !== currentVersion && hasNewerVersion)
      return this.makeNewVersionCommand(serverVersion, codeLensItem)
    else
      return this.makeLatestCommand(codeLensItem);
  }

  makeNewVersionCommand(newerVersion, codeLensItem) {
    codeLensItem.command = {
      title: `&uarr; ${this.appConfig.versionPrefix}${newerVersion}`,
      command: `_${this.appConfig.extentionName}.updateDependencyCommand`,
      arguments: [
        codeLensItem,
        `"${this.appConfig.versionPrefix}${newerVersion}"`
      ]
    };
    return codeLensItem;
  }

  makeSatisfiedCommand(codeLensItem) {
    codeLensItem.command = {
      title: 'satisfied',
      command: undefined,
      arguments: undefined
    };
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