/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {bootstrapLoaded} from './bootstrap';
import {Disposable, DocumentSelector, languages, commands} from 'vscode';
import {NpmCodeLensProvider} from './providers/npmCodeLensProvider';
import {BowerCodeLensProvider} from './providers/bowerCodeLensProvider';
import {updateDependencyCommand, updateDependenciesCommand} from './commands';
import {AppConfiguration} from './models/appConfiguration';

export function activate(context) {
  const npmSelector = {
    language: 'json',
    scheme: 'file',
    pattern: '**/package.json'
  };

  const bowerSelector = {
    language: 'json',
    scheme: 'file',
    pattern: '**/bower.json'
  };

  const config = new AppConfiguration();

  const disposables = [];
  disposables.push(
    languages.registerCodeLensProvider(
      npmSelector,
      new NpmCodeLensProvider(config)
    )
  );

  disposables.push(
    languages.registerCodeLensProvider(
      bowerSelector,
      new BowerCodeLensProvider(config)
    )
  );

  disposables.push(
    commands.registerCommand(
      `_${config.extentionName}.updateDependencyCommand`,
      updateDependencyCommand
    )
  );

  // disposables.push(
  //   commands.registerCommand(
  //     `_${config.extentionName}.updateDependenciesCommand`,
  //     updateDependenciesCommand
  //   )
  // );

  context.subscriptions.push(...disposables);
}