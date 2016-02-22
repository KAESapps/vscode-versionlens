/* --------------------------------------------------------------------------------------------
 * Copyright (c) Peter Flannery. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
const semver = require('semver');

import {TextDocument, Range, Uri} from 'vscode';
import {PackageCodeLens} from '../models/packageCodeLens';

export class PackageCodeLensList {

  private collection: PackageCodeLens[];
  private document: TextDocument;

  constructor(document: TextDocument) {
    this.collection = [];
    this.document = document;
  }

  public add(node) {
    const packageEntry = node.value;
    const range: Range = new Range(
      this.document.positionAt(packageEntry.start),
      this.document.positionAt(packageEntry.end)
    );
    const parent: boolean = packageEntry.type === 'object';

    let packageValue = '';
    if (parent === false)
      packageValue = packageEntry.value.replace('^', '').replace('~', '')

    if (semver.valid(packageValue) === null)
      packageValue = '0.0.0';

    this.collection.push(
      new PackageCodeLens(
        range,
        Uri.file(this.document.fileName),
        packageEntry.name,
        packageValue,
        parent
      )
    );
  }

  public addRange(nodes: any[]) {
    nodes.forEach((node) => this.add(node));
  }

  public get list(): PackageCodeLens[] {
    return this.collection;
  }

}