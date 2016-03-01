import {workspace} from 'vscode';

export class AppConfiguration {

  get extentionName() {
    return "versionlens";
  }

  get versionPrefix() {
    let config = workspace.getConfiguration('versionlens');
    return config.get("versionPrefix", "^");
  }

}