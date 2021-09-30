"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var index_1 = require("../apis/index");
var constants_1 = require("../constants");
var playback_1 = require("../playback");
var types_1 = require("../types");
var createWindow = function () {
    // Create the browser window.
    var win = new electron_1.BrowserWindow({
        transparent: true,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        maximizable: false,
        minimizable: false,
        width: 300,
        height: 60,
        hasShadow: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, '..', 'preload.js')
        }
    });
    if (constants_1.isDev) {
        // caution: can't transparent if open devtools
        win.loadURL('http://localhost:3000');
    }
    else {
        win.loadFile(path.join(__dirname, '../../build/index.html'));
    }
    win.setVisibleOnAllWorkspaces(true);
    win.setBackgroundColor('#00000000');
    electron_1.ipcMain.on('LAYOUT.RESIZE_WINDOW', function (_event, payload) {
        var bounds = win.getBounds();
        var diff = {
            width: payload.width - bounds.width,
            height: payload.height - bounds.height
        };
        var display = electron_1.screen.getPrimaryDisplay().bounds;
        var x;
        var y;
        if (bounds.x < 5) {
            x = bounds.x;
        }
        else if (display.width - 5 < bounds.x + bounds.width) {
            x = bounds.x + bounds.width - Math.round(payload.width);
        }
        else {
            x = Math.min(Math.max(0, bounds.x - Math.round(diff.width / 2)), display.width - Math.round(payload.width));
        }
        if (bounds.y < 5) {
            y = bounds.y;
        }
        else if (display.height - 5 < bounds.y + bounds.height) {
            y = bounds.y + bounds.height - Math.round(payload.height);
        }
        else {
            y = Math.min(Math.max(0, bounds.y - Math.round(diff.height / 2)), display.height - Math.round(payload.height));
        }
        var nextBounds = {
            x: x,
            y: y,
            width: Math.round(payload.width),
            height: Math.round(payload.height)
        };
        if (nextBounds.width < bounds.width) {
            win.setBounds(__assign(__assign({}, nextBounds), { width: bounds.width }));
            setTimeout(function () {
                win.setBounds(nextBounds);
            }, 400);
        }
        else {
            win.setBounds(nextBounds);
        }
    });
    playback_1["default"].on(types_1.EventName.START, function (_a) {
        var detail = _a.detail;
        win.show();
        index_1.startMusic(win, detail);
    });
    playback_1["default"].on(types_1.EventName.STOP, function () {
        index_1.stopMusic(win);
        win.hide();
    });
    playback_1["default"].on(types_1.EventName.PAUSE, function () { index_1.pauseMusic(win); });
    playback_1["default"].on(types_1.EventName.SEEK, function (_a) {
        var detail = _a.detail;
        index_1.seekMusic(win, detail);
    });
    return win;
};
exports["default"] = createWindow;
