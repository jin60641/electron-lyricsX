"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var constants_1 = require("../constants");
var preferenceWindow = function () {
    var isBeforeQuit = false;
    var win = new electron_1.BrowserWindow({
        show: false,
        frame: false,
        resizable: false,
        maximizable: false,
        minimizable: false,
        width: 800,
        height: 700,
        webPreferences: {
            // if electron update to <= 15
            // enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, '..', 'preload.js')
        }
    });
    if (constants_1.isDev) {
        win.loadURL('http://localhost:3000/#/preference/theme');
    }
    else {
        win.loadFile(path.join(__dirname, '..', '..', 'build', 'index.html#/preference/theme'));
    }
    var handleClose = function (e) {
        if (!isBeforeQuit) {
            e.preventDefault();
            win.hide();
        }
    };
    win.setBackgroundColor('#00000000');
    win.on('close', handleClose);
    electron_1.app.on('before-quit', function () {
        isBeforeQuit = true;
    });
    electron_1.ipcMain.on('LAYOUT.CLOSE_PREFERENCE', function () {
        win.hide();
    });
    return win;
};
exports["default"] = preferenceWindow;
