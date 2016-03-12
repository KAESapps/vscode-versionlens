/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {assertDefined} from '../common/typeAssertion';
import {Range, Uri} from 'vscode';
import {PackageCodeLens} from '../models/packageCodeLens';

export class PackageCodeLensList {

  constructor(document) {
    assertDefined(
      document,
      "PackageCodeLensList: document parameter is invalid"
    );
    this.collection = [];
    this.document = document;
  }

  add(node) {
    const packageEntry = node.value;
    const range = new Range(
      this.document.positionAt(packageEntry.start),
      this.document.positionAt(packageEntry.end)
    );
    const parent = packageEntry.type === 'object';

    this.collection.push(
      new PackageCodeLens(
        range,
        Uri.file(this.document.fileName),
        packageEntry.name,
        packageEntry.value,
        parent
      )
    );
  }

  addRange(nodes) {
    nodes.forEach((node) => this.add(node));
  }

  get list() {
    return this.collection;
  }

}