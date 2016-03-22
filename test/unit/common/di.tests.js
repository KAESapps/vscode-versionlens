import * as assert from 'assert';
import {register, inject} from '../../../src/common/di';

describe('Dependency Injection', () => {

  describe('Inject Decorator', () => {

    it('throws an error when dependency does not exist', () => {

      @inject('missing')
      class TestClass {
        get injected() {
          return this.missing;
        }
      }
      const testInstance = new TestClass();
      assert.throws(() => testInstance.injected, ReferenceError, 'Resolve: Could not resolve dependency {missing}');
    });

    it('injects dependencies on to sup.prototype for non-extended classes', () => {
      register('testLibDependency', { test: 123 });

      @inject('testLibDependency')
      class TestClass {
        get injected() {
          return this.testLibDependency;
        }
      }

      const testInstance = new TestClass();
      assert.equal(testInstance.injected.test, 123);
    });

  });

});