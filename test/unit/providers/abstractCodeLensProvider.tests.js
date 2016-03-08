/* --------------------------------------------------------------------------------------------
 * Copyright (c) Peter Flannery. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from 'assert';
import {AppConfiguration} from '../../../src/models/appConfiguration';

describe("AbstractCodeLensProvider", () => {

  describe("constructor", () => {

    it('throws error when appConfig is undefined/null/wrongtype', () => {
      const expectedMsg = "AbstractCodeLensProvider: appConfig parameter is invalid";
      let testThrowFn = () => {
        new AbstractCodeLensProvider(undefined);
      };
      assert.throws(testThrowFn, expectedMsg);

      testThrowFn = () => {
        new AbstractCodeLensProvider(null);
      };
      assert.throws(testThrowFn, expectedMsg);

      testThrowFn = () => {
        new AbstractCodeLensProvider({});
      };
      assert.throws(testThrowFn, expectedMsg);
    });

  });

});