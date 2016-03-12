/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {assertDefined} from './typeAssertion';

export function resolve(dependencyKey) {
  const instance = resolve[dependencyKey];
  assertDefined(instance, `Resolve: Could not resolve dependency {${dependencyKey}}`);
  return instance;
}

export function register(dependencyKey, instance) {
  Object.defineProperty(resolve, dependencyKey, {
    value: instance,
    writable: true
  });
}

/**
 * Creates a man in the middle class
 * which stores a reference to the requested dependencies.
 * If superClass is defined then the man in the middle class will extend from superClass.
 */
export function InstantiateMixin(dependencies, superClass) {
  let mixinClass;
  if (!superClass)
    mixinClass = class { };
  else
    mixinClass = class extends superClass { };

  // stote a ref to the dependency map
  Object.defineProperty(mixinClass.prototype, `__injected`, {
    value: resolve
  });

  // store a reference for each requested dependency on to the mixin class
  dependencies.forEach(dependency => {
    const lookupKey = dependency.name || dependency;

    // define the lookup variable for this dependency
    Object.defineProperty(mixinClass.prototype, `__${lookupKey}`, {
      value: lookupKey,
      enumerable: false
    });

    // define the getter for this dependency instance
    Object.defineProperty(mixinClass.prototype, lookupKey, {
      get() {
        return this.__injected(this[`__${lookupKey}`]);
      }
    });

  });

  return mixinClass;
}