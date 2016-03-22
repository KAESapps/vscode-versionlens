/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {workspace} from 'vscode';

export class AppConfiguration {

  get extentionName() {
    return "versionlens";
  }

  get versionPrefix() {
    const config = workspace.getConfiguration('versionlens');
    return config.get("versionPrefix", "");
  }

}