/* --------------------------------------------------------------------------------------------
 * Copyright (c) Peter Flannery. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import {Disposable, ExtensionContext, DocumentSelector, languages, commands} from 'vscode';
import {NpmCodeLensProvider} from './providers/npmCodeLensProvider';
import {BowerCodeLensProvider} from './providers/bowerCodeLensProvider';
import {updateDependencyCommand, updateDependenciesCommand} from './commands';
import {AppConfiguration} from './models/appConfiguration';
import {JsonService} from './services/jsonService';

export function activate(context: ExtensionContext) {
  const npmSelector: DocumentSelector = {
    language: 'json',
    scheme: 'file',
    pattern: '**/package.json'
  };

  const bowerSelector: DocumentSelector = {
    language: 'json',
    scheme: 'file',
    pattern: '**/bower.json'
  };

  const config = new AppConfiguration();
  const jsonService = new JsonService();

  const disposables: Disposable[] = [];
  disposables.push(languages.registerCodeLensProvider(npmSelector, new NpmCodeLensProvider(config, jsonService)));
  disposables.push(languages.registerCodeLensProvider(bowerSelector, new BowerCodeLensProvider(config, jsonService)));
  disposables.push(commands.registerCommand(`_${config.extentionName}.updateDependencyCommand`, updateDependencyCommand));
  disposables.push(commands.registerCommand(`_${config.extentionName}.updateDependenciesCommand`, updateDependenciesCommand));

  context.subscriptions.push(...disposables);
}