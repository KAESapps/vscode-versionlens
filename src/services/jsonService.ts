/* --------------------------------------------------------------------------------------------
 * Copyright (c) Peter Flannery. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import {extensions} from 'vscode';

export interface IXHRResponse {
  responseText: string;
  status: number;
}

export class JsonService {
  private httpRequest;
  private jsonParser;

  constructor() {
    const jsonExt = extensions.getExtension('vscode.json');
    this.jsonParser = require(jsonExt.extensionPath + '/server/out/jsonParser');
    this.httpRequest = require(jsonExt.extensionPath + '/server/out/utils/httpRequest');
  }

  parseJson(text: string) {
    return this.jsonParser.parse(text);
  }

  createHttpRequest(queryUrl): Thenable<IXHRResponse> {
    return this.httpRequest.xhr({ url: queryUrl });
  }
}