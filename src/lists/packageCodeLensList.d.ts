/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {TextDocument} from 'vscode';
import {PackageCodeLens} from '../models/packageCodeLens';

export class PackageCodeLensList {
  private collection: PackageCodeLens[];
  private document: TextDocument;
  public list: PackageCodeLens[]
  constructor(document: TextDocument);
  public add(node);
  public addRange(nodes: any[]);
}