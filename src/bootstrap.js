/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Peter Flannery. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {register} from './common/di';
const semver = require('semver');
const bower = require('bower');
register('semver', semver);
register('bower', bower);

// load extension deps
import {extensions} from 'vscode';
const jsonExt = extensions.getExtension('vscode.json');
const jsonParser = require(jsonExt.extensionPath + '/server/out/jsonParser');
const httpRequest = require(jsonExt.extensionPath + '/server/out/utils/httpRequest')
register('jsonParser', jsonParser);
register('httpRequest', httpRequest);

export const bootstrapLoaded = true;