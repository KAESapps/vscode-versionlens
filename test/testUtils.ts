/* --------------------------------------------------------------------------------------------
 * Copyright (c) Peter Flannery. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import * as pathUtils from 'path';
import * as fs from 'fs';

export interface TestFixture {
  path: string;
  basename: string;
  content: string;
}

export class TestFixtureMap {
  private cache;
  private fixtureRootPath: string;

  constructor(fixtureRootPath: string) {
    this.fixtureRootPath = fixtureRootPath;
    if (fs.existsSync(fixtureRootPath) === false) {
      throw new ReferenceError("Fixture root path not found. " + fixtureRootPath);
    }
    this.cache = {};
  }

  read(fixtureRelativePath: string): TestFixture {
    let cachedEntry = this.cache[fixtureRelativePath];
    if (cachedEntry === undefined) {
      let fullPath: string = pathUtils.join(this.fixtureRootPath, fixtureRelativePath);
      if (fs.existsSync(fullPath) === false) {
        throw new ReferenceError("Path not found. " + fullPath);
      }

      if (fs.statSync(fullPath).isFile() === false) {
        throw new ReferenceError("Path must be a valid file location. " + fullPath);
      }

      cachedEntry = {
        path: fullPath,
        basename: pathUtils.basename(fullPath),
        content: fs.readFileSync(fullPath).toString()
      };
      this.cache[fixtureRelativePath] = cachedEntry;
    }

    return cachedEntry;
  }

}