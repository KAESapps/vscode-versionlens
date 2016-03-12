/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {InstantiateMixin} from '../common/di';
import {assertInstanceOf} from '../common/typeAssertion';
import {AppConfiguration} from '../models/appConfiguration';

export abstract class AbstractCodeLensProvider
  extends InstantiateMixin(['semver']) {

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
    const isValid = super.semver.valid(localVersion);
    const isValidRange = super.semver.validRange(localVersion);

    if (!isValid && !isValidRange && localVersion !== 'latest')
      return this.makeErrorCommand(-1, "Invalid version entered", codeLensItem);

    if (localVersion === 'latest')
      return this.makeLatestCommand(codeLensItem);

    if (this.appConfig.satisfyOnly === true
      && super.semver.satisfies(serverVersion, localVersion))
      return this.makeSatisfiedCommand(serverVersion, codeLensItem);

    if (isValidRange && !isValid) {
      if (super.semver.satisfies(serverVersion, localVersion))
        return this.makeSatisfiedCommand(serverVersion, codeLensItem);
      else
        return this.makeNewVersionCommand(serverVersion, codeLensItem)
    }

    const hasNewerVersion = super.semver.gt(serverVersion, localVersion) === true
      || super.semver.lt(serverVersion, localVersion) === true;

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