/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {inject} from '../common/di';
import {assertInstanceOf} from '../common/typeAssertion';
import {AppConfiguration} from '../models/appConfiguration';

@inject('semver')
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

  makeVersionCommand(localVersion, serverVersion, codeLensItem) {
    const isLocalValid = this.semver.valid(localVersion);
    const isLocalValidRange = this.semver.validRange(localVersion);
    const isServerValid = this.semver.valid(serverVersion);
    const isServerValidRange = this.semver.validRange(serverVersion);

    if (!isLocalValid && !isLocalValidRange && localVersion !== 'latest')
      return this.makeErrorCommand(-1, "Invalid semver version entered", codeLensItem);

    if (!isServerValid && !isServerValidRange && serverVersion !== 'latest')
      return this.makeErrorCommand(-1, "Invalid semver server version received, " + serverVersion, codeLensItem);

    if (localVersion === 'latest')
      return this.makeLatestCommand(codeLensItem);

    if (isLocalValidRange && !isLocalValid) {
      if (this.semver.satisfies(serverVersion, localVersion))
        return this.makeSatisfiedCommand(serverVersion, codeLensItem);
      else
        return this.makeNewVersionCommand(serverVersion, codeLensItem)
    }

    const hasNewerVersion = this.semver.gt(serverVersion, localVersion) === true
      || this.semver.lt(serverVersion, localVersion) === true;

    if (serverVersion !== localVersion && hasNewerVersion)
      return this.makeNewVersionCommand(serverVersion, codeLensItem)

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

  makeSatisfiedCommand(serverVersion, codeLensItem) {
    codeLensItem.command = {
      title: `satisfies v${serverVersion}`,
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