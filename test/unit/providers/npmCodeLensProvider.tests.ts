/* --------------------------------------------------------------------------------------------
 * Copyright (c) Peter Flannery. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import * as assert from 'assert';
import * as path from 'path';

import * as vscode from 'vscode';
import {TestFixtureMap} from '../../testUtils';
import {NpmCodeLensProvider} from '../../../src/providers/npmCodeLensProvider';
import {AppConfiguration} from '../../../src/models/AppConfiguration';
import {JsonService} from '../../../src/services/JsonService';

describe("NpmCodeLensProvider", () => {

  const testPath = path.join(__dirname, '../../../..', 'test');
  const fixturePath = path.join(testPath, 'fixtures');
  const fixtureMap = new TestFixtureMap(fixturePath);

  describe("provideCodeLenses", () => {

    it("returns empty array when the document json is invalid", () => {
      let appConfig = new AppConfiguration();
      let jsonService = new JsonService();
      let provider = new NpmCodeLensProvider(appConfig, jsonService);
      let fixture = fixtureMap.read('package-invalid.json');

      let testDocument = {
        getText: (range?: vscode.Range) => fixture.content
      };

      let codeLens = provider.provideCodeLenses(testDocument, null);
      assert.ok(codeLens instanceof Array, "codeLens should be an array.");
      assert.ok(codeLens.length === 0, "codeLens should be an empty array.");
    });

    it("returns empty array when the document text is empty", () => {
      let appConfig = new AppConfiguration();
      let jsonService = new JsonService();
      let provider = new NpmCodeLensProvider(appConfig, jsonService);

      let testDocument = {
        getText: (range?: vscode.Range) => ''
      };

      let codeLens = provider.provideCodeLenses(testDocument, null);
      assert.ok(codeLens instanceof Array, "codeLens should be an array.");
      assert.ok(codeLens.length === 0, "codeLens should be an empty array.");
    });

    it("returns empty array when the package has no dependencies", () => {
      let appConfig = new AppConfiguration();
      let jsonService = new JsonService();
      let provider = new NpmCodeLensProvider(appConfig, jsonService);
      let fixture = fixtureMap.read('package-no-deps.json');

      let testDocument = {
        getText: (range?: vscode.Range) => fixture.content
      };

      let codeLens = provider.provideCodeLenses(testDocument, null);
      assert.ok(codeLens instanceof Array, "codeLens should be an array.");
      assert.ok(codeLens.length === 0, "codeLens should be an empty array.");
    });

    it("returns array of given dependencies to be resolved", () => {
      let appConfig = new AppConfiguration();
      let jsonService = new JsonService();
      let provider = new NpmCodeLensProvider(appConfig, jsonService);
      let fixture = fixtureMap.read('package-with-deps.json');

      let testDocument = {
        getText: (range?: vscode.Range) => fixture.content,
        positionAt: (offset: number): vscode.Position => new vscode.Position(0, 0),
        fileName: fixture.basename
      };

      let codeLens = provider.provideCodeLenses(testDocument, null);
      assert.ok(codeLens instanceof Array, "codeLens should be an array.");
      assert.equal(codeLens.length, 4, "codeLens should be an array containing 4 items.");

      codeLens.forEach((entry, index) => {
        assert.equal(entry.packageName, `dep${index + 1}`, `dependency name should be dep${index + 1}.`);
      });

    });

  });

  describe("resolveCodeLens", () => {


  });

});