/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export function assertInstanceOf(param, expectedParamType, msgOnFail) {
  if (param instanceof expectedParamType === false)
    throw new ReferenceError(msgOnFail)
}

export function assertTypeOf(param, expectedParamType, msgOnFail) {
  if (typeof param !== expectedParamType)
    throw new ReferenceError(msgOnFail)
}

export function assertDefined(param, msgOnFail) {
  if (param === undefined || param === null)
    throw new ReferenceError(msgOnFail)
}

export function assertEmpty(param, msgOnFail) {
  if (param.length === 0)
    throw new ReferenceError(msgOnFail)
}