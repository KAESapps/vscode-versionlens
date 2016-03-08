/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export function assertInstanceOf(
  param: any,
  expectedParamType: any,
  msgOnFail: string
): void;

export function assertTypeOf(
  param: any,
  expectedParamType: any,
  msgOnFail: string
): void;

export function assertDefined(param: any, msgOnFail: string): void;
export function assertEmpty(param: any, msgOnFail: string): void;