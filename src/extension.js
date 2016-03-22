/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {bootstrapLoaded} from './bootstrap';
import * as vscode from 'vscode';
import {Disposable, DocumentSelector, languages, commands} from 'vscode';
import {NpmCodeLensProvider} from './providers/npmCodeLensProvider';
import {BowerCodeLensProvider} from './providers/bowerCodeLensProvider';
import {DubCodeLensProvider} from './providers/dubCodeLensProvider';
import {DotNetCodeLensProvider} from './providers/dotNetCodeLensProvider';
import {updateDependencyCommand, updateDependenciesCommand} from './commands';
import {AppConfiguration} from './models/appConfiguration';

export function activate(context) {
  if (bootstrapLoaded === false)
    throw ReferenceError("VersionCodelens: didnt execute it's bootstrap.");

  const config = new AppConfiguration();
  const disposables = [];
  const providers = [
    new NpmCodeLensProvider(config),
    new BowerCodeLensProvider(config),
    new DubCodeLensProvider(config),
    new DotNetCodeLensProvider(config)
  ];

  providers.forEach(provider => {
    disposables.push(
      languages.registerCodeLensProvider(
        provider.selector,
        provider
      )
    );
  })

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