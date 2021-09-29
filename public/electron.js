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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var electron_1 = require("electron");
var isDev = require("electron-is-dev");
var path = require("path");
var index_1 = require("./apis/index");
var playback_1 = require("./playback");
var types_1 = require("./types");
var close = function () { return null; };
var isMac = process.platform === 'darwin';
if (isMac) {
    electron_1.app.dock.hide();
}
electron_1.app.on('window-all-closed', function () {
    close();
    electron_1.app.quit();
});
electron_1.app.on('before-quit', close);
electron_1.app.on('will-quit', close);
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
            preload: __dirname + "/preload.js"
        }
    });
    if (isDev) {
        win.loadURL('http://localhost:3000');
        // caution: can't transparent if open devtools
        // win.webContents.openDevTools();
    }
    else {
        win.loadFile(path.join(__dirname, '../build/index.html'));
    }
    var template = __spreadArrays((isMac ? [{
            label: electron_1.app.name,
            submenu: [
                { role: 'about' },
                {
                    label: 'Preferences...',
                    click: function () { return index_1.openPreference(win); },
                    accelerator: 'Command+,'
                },
            ]
        }] : []), [
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forcereload' },
                { role: 'toggledevtools' },
                { type: 'separator' },
                { role: 'resetzoom' },
                { role: 'zoomin' },
                { role: 'zoomout' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
            ]
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: __spreadArrays([
                { role: 'minimize' },
                { role: 'zoom' }
            ], (isMac ? [
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'window' },
            ] : [
                { role: 'close' },
            ]))
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, electron_1.shell.openExternal('https://github.com/jin60641/lyrics')];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }
                },
            ]
        },
    ]);
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
    var menu = electron_1.Menu.buildFromTemplate(template);
    electron_1.Menu.setApplicationMenu(menu);
    playback_1["default"].on(types_1.EventName.START, function (_a) {
        var detail = _a.detail;
        index_1.startMusic(win, detail);
    });
    playback_1["default"].on(types_1.EventName.STOP, function () { index_1.stopMusic(win); });
    playback_1["default"].on(types_1.EventName.PAUSE, function () { index_1.pauseMusic(win); });
    playback_1["default"].on(types_1.EventName.SEEK, function (_a) {
        var detail = _a.detail;
        index_1.seekMusic(win, detail);
    });
};
electron_1.app.whenReady().then(createWindow);
