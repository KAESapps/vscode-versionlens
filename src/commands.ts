/* --------------------------------------------------------------------------------------------
 * Copyright (c) Peter Flannery. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import {workspace, Range, Uri, TextEdit, WorkspaceEdit} from 'vscode';
import {PackageCodeLens} from './models/packageCodeLens';

export function updateDependencyCommand(codeLens: PackageCodeLens, packageVersion: string) {
  const edit = new WorkspaceEdit();
  const edits = [TextEdit.replace(codeLens.range, packageVersion)];
  edit.set(codeLens.uri, edits);
  return workspace.applyEdit(edit);
}

export function updateDependenciesCommand(codeLens: PackageCodeLens, packageVersion: string) {
  // const edit = new WorkspaceEdit();
  // const edits = [TextEdit.replace(codeLens.range, packageVersion)];
  // edit.set(codeLens.uri, edits);
  // workspace.applyEdit(edit);
}