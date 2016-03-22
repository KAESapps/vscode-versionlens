/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {assertDefined} from './typeAssertion';

const resolveMap = {};

/**
 * resolves dependencies from the resolve map
 */
export function resolve(dependencyKey) {
  const instance = resolveMap[dependencyKey];
  assertDefined(instance, `Resolve: Could not resolve dependency {${dependencyKey}}`);
  return instance;
}

/**
 * registers dependencies to the resolve map
 */
export function register(dependencyKey, instance) {
  resolveMap[dependencyKey] = instance;
}

/**
 * injects dependencies found in the resolve map
 */
export function inject() {
  const resolvableKeys = [];
  for (var index = 0; index < arguments.length; index++) {
    resolvableKeys.push(arguments[index]);
  }

  return function(target, key, desc) {
    const prototype = target.prototype;
    if (!prototype.__resolve)
      prototype.__resolve = resolve;

    for (let index = 0; index < resolvableKeys.length; index++) {
      let resolveKey = resolvableKeys[index];
      Object.defineProperty(prototype, resolveKey, {
        get() {
          return this.__resolve(resolveKey);
        }
      });
    }
  }
}
