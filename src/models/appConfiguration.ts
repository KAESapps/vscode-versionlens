import {workspace} from 'vscode';

export class AppConfiguration {

  get extentionName() {
    return "versionlens";
  }

  get versionPrefix() {
    let config = workspace.getConfiguration('versionVisibility');
    return config.get("versionPrefix", "^");
  }

}