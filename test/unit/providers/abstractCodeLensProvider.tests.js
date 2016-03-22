/* --------------------------------------------------------------------------------------------
 * Copyright (c) Peter Flannery. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from 'assert';
import {register} from '../../../src/common/di';
import {AppConfiguration} from '../../../src/models/appConfiguration';
import {AbstractCodeLensProvider} from '../../../src/providers/abstractCodeLensProvider';

const semver = require('semver');

describe("AbstractCodeLensProvider", () => {
  let testProvider;
  let appConfigMock = new AppConfiguration();
  let defaultVersionPrefix;
  Object.defineProperty(appConfigMock, 'versionPrefix', { get: () => defaultVersionPrefix })

  beforeEach(() => {
    register('semver', semver);
    // mock the config
    defaultVersionPrefix = '^';
    testProvider = new AbstractCodeLensProvider(appConfigMock);
  });

  describe('constructor', () => {

    it('throws error when appConfig is undefined/null/wrongtype', () => {
      const expectedMsg = "AbstractCodeLensProvider: appConfig parameter is invalid";
      let testThrowFn = () => new AbstractCodeLensProvider(undefined);
      assert.throws(testThrowFn, expectedMsg);

      testThrowFn = () =>  new AbstractCodeLensProvider(null);
      assert.throws(testThrowFn, expectedMsg);

      testThrowFn = () => new AbstractCodeLensProvider({});
      assert.throws(testThrowFn, expectedMsg);
    });

  });

  describe('makeVersionCommand', () => {

    it("when local version is invalid then should return ErrorCommand", () => {
      const testLens = testProvider.makeVersionCommand('blah', 'latest', {});
      assert.equal(testLens.command.title, 'Error -1. Invalid semver version entered', "Expected command.title failed.");
      assert.equal(testLens.command.command, undefined);
      assert.equal(testLens.command.arguments, undefined);
    });

    it("when server version is invalid then should return ErrorCommand", () => {
      const testLens = testProvider.makeVersionCommand('1.2.3', '1.0.0.5', {});
      assert.equal(testLens.command.title, 'Error -1. Invalid semver server version received, 1.0.0.5', "Expected command.title failed.");
      assert.equal(testLens.command.command, undefined);
      assert.equal(testLens.command.arguments, undefined);
    })

    it("when server and local version are 'latest' then codeLens should return LatestCommand", () => {
      const testLens = testProvider.makeVersionCommand('latest', 'latest', {});
      assert.equal(testLens.command.title, 'latest', "Expected command.title failed.");
      assert.equal(testLens.command.command, undefined);
      assert.equal(testLens.command.arguments, undefined);
    });

    it("when local ranged version does not satisfy the server version then codeLens should return NewVersionCommand", () => {
      defaultVersionPrefix = '^';
      const testLens = testProvider.makeVersionCommand('1.0.0 - 2.0.0', '2.8.0', {});
      assert.equal(testLens.command.title, '&uarr; ^2.8.0', "Expected command.title failed.");
      assert.equal(testLens.command.command, '_versionlens.updateDependencyCommand');
      assert.equal(testLens.command.arguments[1], '"^2.8.0"');
    });

    it("when local ranged version does not satisfy the server version then codeLens should return NewVersionCommand", () => {
      defaultVersionPrefix = '^';
      const testLens = testProvider.makeVersionCommand('1.0.0 - 2.0.0', '2.8.0', {});
      assert.equal(testLens.command.title, '&uarr; ^2.8.0', "Expected command.title failed.");
      assert.equal(testLens.command.command, '_versionlens.updateDependencyCommand');
      assert.equal(testLens.command.arguments[1], '"^2.8.0"');
    });

    it("when local ranged version does satisfy the server version then codeLens should return SatisfiedCommand", () => {
      defaultVersionPrefix = '^';
      const testLens = testProvider.makeVersionCommand('1.0.0 - 3.0.0', '2.8.0', {});
      assert.equal(testLens.command.title, 'satisfies v2.8.0', "Expected command.title failed.");
      assert.equal(testLens.command.command, undefined);
      assert.equal(testLens.command.arguments, undefined);
    });

    it("when local version has caret and doesnt satisfies the server version then codeLens should return NewVersionCommand", () => {
      defaultVersionPrefix = '^';
      const testLens = testProvider.makeVersionCommand('^1.8.0', '2.8.0', {});
      assert.equal(testLens.command.title, '&uarr; ^2.8.0', "Expected command.title failed.");
      assert.equal(testLens.command.command, '_versionlens.updateDependencyCommand');
      assert.equal(testLens.command.arguments[1], '"^2.8.0"');
    });

    it("when local version has caret and satisfies the server version then codeLens should return SatisfiedCommand", () => {
      defaultVersionPrefix = '^';
      const testLens = testProvider.makeVersionCommand('^2.0.0', '2.8.0', {});
      assert.equal(testLens.command.title, 'satisfies v2.8.0', "Expected command.title failed.");
      assert.equal(testLens.command.command, undefined);
      assert.equal(testLens.command.arguments, undefined);
    });

    it("when local version does not satisfy the server version then codeLens should return NewVersionCommand", () => {
      defaultVersionPrefix = '^';
      const testLens = testProvider.makeVersionCommand('1.0.0', '2.8.0', {});
      assert.equal(testLens.command.title, '&uarr; ^2.8.0', "Expected command.title failed.");
      assert.equal(testLens.command.command, '_versionlens.updateDependencyCommand');
      assert.equal(testLens.command.arguments[1], '"^2.8.0"');
    });

    it("when local version does satisfy the server version then codeLens should return LatestCommand", () => {
      defaultVersionPrefix = '^';
      const testLens = testProvider.makeVersionCommand('2.8.0', '2.8.0', {});
      assert.equal(testLens.command.title, 'latest', "Expected command.title failed.");
      assert.equal(testLens.command.command, undefined);
      assert.equal(testLens.command.arguments, undefined);
    });

  });

});