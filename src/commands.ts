/* --------------------------------------------------------------------------------------------
 * Copyright (c) Peter Flannery. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import {workspace, Range, Uri, TextEdit, WorkspaceEdit} from 'vscode';

export function updateDependencyCommand(uri: Uri, packageVersion: string, range: Range) {
  const edit = new WorkspaceEdit();
  const edits = [TextEdit.replace(range, packageVersion)];
  edit.set(uri, edits);
  workspace.applyEdit(edit);
}

export function updateDependenciesCommand(uri: Uri, packageVersion: string, range: Range) {
  const edit = new WorkspaceEdit();
  const edits = [TextEdit.replace(range, packageVersion)];
  edit.set(uri, edits);
  workspace.applyEdit(edit);
}