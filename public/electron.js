"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var constants_1 = require("./constants");
var menu_1 = require("./menu");
var windows_1 = require("./windows");
var close = function () { return null; };
if (constants_1.isMac) {
    electron_1.app.dock.hide();
}
electron_1.app.on('window-all-closed', function () {
    close();
    electron_1.app.quit();
});
electron_1.app.on('before-quit', close);
electron_1.app.on('will-quit', close);
electron_1.app.whenReady().then(function () {
    menu_1["default"](windows_1["default"]());
});
