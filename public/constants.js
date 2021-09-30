"use strict";
exports.__esModule = true;
exports.isMac = exports.isDev = void 0;
var _isDev = require("electron-is-dev");
exports.isDev = _isDev;
exports.isMac = process.platform === 'darwin';
