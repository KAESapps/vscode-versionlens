/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {resolve} from '../common/di';
import {Disposable} from 'vscode';
import {AppConfiguration} from '../models/appConfiguration';
import {PackageCodeLens} from '../models/packageCodeLens';

export abstract class AbstractCodeLensProvider {
  protected _disposables: Disposable[];
  protected appConfig: AppConfiguration;

  constructor(appConfig: AppConfiguration);
  dispose();
  protected makeErrorCommand(statusCode: number, errorMsg: string, codeLensItem: PackageCodeLens): PackageCodeLens;
  protected makeVersionCommand(currentVersion: string, checkVersion: string, codeLensItem: PackageCodeLens): PackageCodeLens;
  protected makeLatestCommand(codeLensItem: PackageCodeLens): PackageCodeLens;
  protected makeUpdateDependenciesCommand(codeLensItem: PackageCodeLens): PackageCodeLens;
}