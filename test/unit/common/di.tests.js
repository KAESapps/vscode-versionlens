import * as assert from 'assert';
import {register, resolve, InstantiateMixin} from '../../../src/common/di';

describe('DependencyInjection', () => {

  describe('resolve', () => {

    it('throws an error when dependency doesnt exist', () => {
      let testThrowFn = () => resolve('missing');
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

  describe('register', () => {

    it('overwrites existing entry with same key', () => {
      register('testValueDependency', { test: 100 });
      assert.equal(resolve.testValueDependency.test, 100);
      register('testValueDependency', { test: 555 });
      assert.equal(resolve.testValueDependency.test, 555);
    });

  });

  describe('InstantiateMixin', () => {

    it('injects dependencies on to super.prototype for non-extended classes', () => {
      register('testLibDependency', { test: 123 });

      class TestClass extends InstantiateMixin(['testLibDependency']) {
        get injected() {
          return super.testLibDependency;
        }
      }

      const testInstance = new TestClass();
      assert.equal(testInstance.injected.test, 123);
    });

    it('injects dependencies on to super.prototype for extended classes', () => {
      register('testLibDependency', { test: 123 });

      class extenderClass { }

      class TestClass extends InstantiateMixin(['testLibDependency'], extenderClass) {
        get injected() {
          return super.testLibDependency;
        }
      }

      const testInstance = new TestClass();
      assert.equal(testInstance.injected.test, 123);
    });

    it('injects dependencies on to super.prototype for extended classes and retains instance values pass to super ctor', () => {
      register('testLibDependency', { test: 123 });

      class extenderClass {
        constructor(inValue) {
          this.inValue = inValue;
        }
      }

      class TestClass extends InstantiateMixin(['testLibDependency'], extenderClass) {
        constructor(inValue) {
          super(inValue)
        }
      }

      const testInstance = new TestClass(123);
      assert.equal(testInstance.inValue, 123);
    });

  });


});