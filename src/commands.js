/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {workspace, TextEdit, WorkspaceEdit} from 'vscode';

export function updateDependencyCommand(codeLens, packageVersion) {
  const edit = new WorkspaceEdit();
  const edits = [TextEdit.replace(codeLens.range, packageVersion)];
  edit.set(codeLens.uri, edits);
  return workspace.applyEdit(edit);
}

// export function updateDependenciesCommand(codeLens, packageVersion) {

// }