/* --------------------------------------------------------------------------------------------
 * Copyright (c) Peter Flannery. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
const semver = require('semver');

import {
Disposable,
TextDocument,
Position,
Range,
Uri
} from 'vscode';

import {AppConfiguration} from '../models/appConfiguration';
import {JsonService} from '../services/jsonService';
import {PackageCodeLens} from '../models/packageCodeLens';

export abstract class AbstractCodeLensProvider {
  protected _disposables: Disposable[];
  protected jsonService: JsonService;
  protected appConfig: AppConfiguration;

  constructor(appConfig: AppConfiguration, jsonService: JsonService) {
    if (!appConfig) {
      throw new ReferenceError("AbstractCodeLensProvider was given an invalid reference to appConfig.")
    }
    if (!jsonService) {
      throw new ReferenceError("AbstractCodeLensProvider was given an invalid reference to jsonService.")
    }
    this._disposables = [];
    this.jsonService = jsonService;
    this.appConfig = appConfig;
  }

  dispose() {
    while (this._disposables.length > 0) {
      this._disposables.pop().dispose();
    }
  }

  protected makeErrorCommand(statusCode: number, errorMsg: string, codeLensItem: PackageCodeLens): PackageCodeLens {
    codeLensItem.command = {
      title: `Error ${statusCode}. ${errorMsg}`,
      command: undefined,
      arguments: undefined
    };
    return codeLensItem;
  }

  protected makeVersionCommand(currentVersion: string, checkVersion: string, codeLensItem: PackageCodeLens): PackageCodeLens {
    if (checkVersion !== currentVersion
      && (semver.gt(checkVersion, currentVersion) === true || semver.lt(checkVersion, currentVersion) === true)) {
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

  protected makeLatestCommand(codeLensItem: PackageCodeLens): PackageCodeLens {
    codeLensItem.command = {
      title: 'latest',
      command: undefined,
      arguments: undefined
    };
    return codeLensItem;
  }

  protected makeUpdateDependenciesCommand(codeLensItem: PackageCodeLens): PackageCodeLens {
    codeLensItem.command = {
      title: '&uarr; Update all',
      command: `_${this.appConfig.extentionName}.updateDependenciesCommand`,
      arguments: []
    };
    return codeLensItem;
  }

}