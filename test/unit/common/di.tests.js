import * as assert from 'assert';
import {register, resolve} from '../../../src/common/di';

describe('DI', () => {

  describe('resolve', () => {

    it('throws an error when dependency doesnt exist', () => {
      let testThrowFn = () => {
        resolve('missing');
      };
      assert.throws(testThrowFn, 'Resolve: Could not resolve dependency {missing}');
    });

    it('resolves value dependency', () => {
      register('testValueDependency', 123);
      const testResolved = resolve('testValueDependency');
      assert.equal(testResolved, 123);
    });

    it('resolves class dependency', () => {
      const instance = new Error();
      register('testClassDependency', instance);
      const testResolved = resolve('testClassDependency');
      assert.equal(testResolved, instance);
    });

    it('resolves value dependency directly', () => {
      register('testValueDependency', 123);
      const testResolved = resolve.testValueDependency;
      assert.equal(testResolved, 123);
    });

  });

});