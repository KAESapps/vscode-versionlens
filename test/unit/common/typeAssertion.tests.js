import * as assert from 'assert';
import {
  assertInstanceOf,
  assertTypeOf,
  assertDefined,
  assertEmpty
} from '../../../src/common/typeAssertion';


describe('TypeAssertion', () => {

  describe('assertInstanceOf', () => {

    it('throws an error when instanceof is false', () => {
      let testThrowFn = () => {
        assertInstanceOf([], String, 'Array is not an instanceof String');
      };
      assert.throws(testThrowFn, 'Array is not an instanceof String');
    });

    it('does not throw an error when instanceof is true', () => {
      let testThrowFn = () => {
        assertInstanceOf([], Array, 'Array is an instanceof Array');
      };
      assert.doesNotThrow(testThrowFn, 'Array is an instanceof Array');
    });

  });

  describe('assertTypeOf', () => {

    it('throws an error when assertTypeOf is false', () => {
      let testThrowFn = () => {
        assertTypeOf('', 'object', 'String is not an typeof object');
      };
      assert.throws(testThrowFn, 'String is not an typeof object');
    });

    it('does not throw an error when assertTypeOf is true', () => {
      let testThrowFn = () => {
        assertTypeOf('', 'string', 'String is a typeof string');
      };
       assert.doesNotThrow(testThrowFn, ReferenceError, 'String is a typeof string');
    });

  });

  describe('assertDefined', () => {

    it('throws an error when assertDefined is false', () => {
      let testThrowFn = () => {
        assertDefined(undefined, 'parameter is undefined');
      };
      assert.throws(testThrowFn, 'parameter is undefined');
    });

    it('does not throw an error when assertDefined is true', () => {
      let testThrowFn = () => {
        assertDefined('', 'parameter is defined');
      };
       assert.doesNotThrow(testThrowFn, ReferenceError, 'parameter is defined');
    });

  });

  describe('assertEmpty', () => {

    it('throws an error when assertEmpty is false', () => {
      let testThrowFn = () => {
        assertEmpty('', 'string is empty');
      };
      assert.throws(testThrowFn, 'string is empty');

      testThrowFn = () => {
        assertEmpty([], 'array is empty');
      };
      assert.throws(testThrowFn, 'array is empty');
    });

    it('does not throw an error when assertEmpty is true', () => {
      let testThrowFn = () => {
        assertEmpty('1', 'string is empty');
      };
       assert.doesNotThrow(testThrowFn, 'string is empty');

      testThrowFn = () => {
        assertEmpty([1], 'array is empty');
      };
       assert.doesNotThrow(testThrowFn, 'array is empty');
    });

  });

});