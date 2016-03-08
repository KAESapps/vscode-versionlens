/* --------------------------------------------------------------------------------------------
 * Copyright (c) Peter Flannery. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
const semver = require('semver');

import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import {register} from '../../../src/common/di';
import {TestFixtureMap} from '../../testUtils';
import {NpmCodeLensProvider} from '../../../src/providers/npmCodeLensProvider';
import {AppConfiguration} from '../../../src/models/appConfiguration';
import {PackageCodeLens} from '../../../src/models/packageCodeLens';

const jsonExt = vscode.extensions.getExtension('vscode.json');
const jsonParser = require(jsonExt.extensionPath + '/server/out/jsonParser');

describe("NpmCodeLensProvider", () => {
  const testPath = path.join(__dirname, '../../../..', 'test');
  const fixturePath = path.join(testPath, 'fixtures');
  const fixtureMap = new TestFixtureMap(fixturePath);

  let testProvider;
  let httpRequestMock = {
    xhr: {}
  };

  beforeEach(() => {
    register('semver', semver);
    register('jsonParser', jsonParser);
    register('httpRequest', httpRequestMock);

    // mock the config
    const appConfig = new AppConfiguration();
    Object.defineProperty(appConfig, 'versionPrefix', { get: () => '^' })

    testProvider = new NpmCodeLensProvider(appConfig);
  });

  describe("provideCodeLenses", () => {

    it("returns empty array when the document json is invalid", () => {
      let fixture = fixtureMap.read('package-invalid.json');

      let testDocument = {
        getText: range => fixture.content
      };

      let codeLens = testProvider.provideCodeLenses(testDocument, null);
      assert.ok(codeLens instanceof Array, "codeLens should be an array.");
      assert.ok(codeLens.length === 0, "codeLens should be an empty array.");
    });

    it("returns empty array when the document text is empty", () => {
      let testDocument = {
        getText: range => ''
      };

      let codeLens = testProvider.provideCodeLenses(testDocument, null);
      assert.ok(codeLens instanceof Array, "codeLens should be an array.");
      assert.ok(codeLens.length === 0, "codeLens should be an empty array.");
    });

    it("returns empty array when the package has no dependencies", () => {
      let fixture = fixtureMap.read('package-no-deps.json');

      let testDocument = {
        getText: range => fixture.content
      };

      let codeLens = testProvider.provideCodeLenses(testDocument, null);
      assert.ok(codeLens instanceof Array, "codeLens should be an array.");
      assert.ok(codeLens.length === 0, "codeLens should be an empty array.");
    });

    it("returns array of given dependencies to be resolved", () => {
      let fixture = fixtureMap.read('package-with-deps.json');

      let testDocument = {
        getText: range => fixture.content,
        positionAt: offset => new vscode.Position(0, 0),
        fileName: fixture.basename
      };

      let codeLens = testProvider.provideCodeLenses(testDocument, null);
      assert.ok(codeLens instanceof Array, "codeLens should be an array.");
      assert.equal(codeLens.length, 4, "codeLens should be an array containing 4 items.");

      codeLens.forEach((entry, index) => {
        assert.equal(entry.packageName, `dep${index + 1}`, `dependency name should be dep${index + 1}.`);
      });
    });

  });

  describe("resolveCodeLens", () => {

    it("when code lens package version is 'latest' codeLens should return LatestCommand", () => {
      const codeLens = new PackageCodeLens(null, null, 'SomePackage', 'latest', false);
      testProvider.resolveCodeLens(codeLens, null);
      assert.equal(codeLens.command.title, 'latest', "Expected command.title failed.");
      assert.equal(codeLens.command.command, undefined);
      assert.equal(codeLens.command.arguments, undefined);
    });

    it("when npm does not return status 200 then codeLens should return ErrorCommand", done => {
      const codeLens = new PackageCodeLens(null, null, 'SomePackage', '1.2.3', false);
      httpRequestMock.xhr = {
        createHttpRequest: queryUrl => {
          return Promise.resolve({
            status: 404,
            responseText: 'Not found'
          });
        }
      };

      testProvider.resolveCodeLens(codeLens, null).then(result => {
        assert.equal(result.command.title, 'Error 404. Not found', "Expected command.title failed.");
        assert.equal(result.command.command, undefined);
        assert.equal(result.command.arguments, undefined);
        done();
      });
    });

    it("when null response object returned from npm then codeLens should return ErrorCommand", done => {
      const codeLens = new PackageCodeLens(null, null, 'SomePackage', '1.2.3', false);

      httpRequestMock.xhr = {
        createHttpRequest: queryUrl => {
          return Promise.resolve({
            status: 200,
            responseText: null
          });
        }
      };

      testProvider.resolveCodeLens(codeLens, null).then(result => {
        assert.equal(result.command.title, 'Error -1. Invalid object returned from server', "Expected command.title failed.");
        assert.equal(result.command.command, undefined);
        assert.equal(result.command.arguments, undefined);
        done();
      });

    });

    it("when response version is missing then codeLens should return ErrorCommand", done => {
      const codeLens = new PackageCodeLens(null, null, 'SomePackage', '1.2.3', false);

      httpRequestMock.xhr = {
        createHttpRequest: queryUrl => {
          return Promise.resolve({
            status: 200,
            responseText: '{}'
          });
        }
      };

      testProvider.resolveCodeLens(codeLens, null).then(result => {
        assert.equal(result.command.title, 'Error -1. Invalid object returned from server', "Expected command.title failed.");
        assert.equal(result.command.command, undefined);
        assert.equal(result.command.arguments, undefined);
        done();
      });
    });

    it("when valid response object returned from npm then codeLens should return VersionCommand", done => {
      const codeLens = new PackageCodeLens(null, null, 'SomePackage', '1.2.3', false);
      httpRequestMock.xhr = {
        createHttpRequest: queryUrl => {
          return Promise.resolve({
            status: 200,
            responseText: '{"version": "3.2.1"}'
          });
        }
      };

      testProvider.resolveCodeLens(codeLens, null).then(result => {
        assert.equal(result.command.title, '&uarr; ^3.2.1');
        assert.equal(result.command.command, '_versionlens.updateDependencyCommand');
        //assert.equal(result.command.arguments[0], null);
        assert.equal(result.command.arguments[1], '"^3.2.1"');
        done();
      });
    });

  });

});