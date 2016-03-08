/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {
  CodeLensProvider,
  CancellationToken,
  CodeLens
} from 'vscode';
import {AppConfiguration} from '../models/appConfiguration';
import {AbstractCodeLensProvider} from './abstractCodeLensProvider';

export class BowerCodeLensProvider extends AbstractCodeLensProvider implements CodeLensProvider {
  private packageDependencyKeys: string[];
  constructor(appConfig: AppConfiguration);
  provideCodeLenses(document, token: CancellationToken);
  resolveCodeLens(codeLensItem: CodeLens, token: CancellationToken): Thenable<CodeLens>;
}