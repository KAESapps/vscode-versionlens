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