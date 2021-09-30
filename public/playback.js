"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var isDev = require("electron-is-dev");
var event_1 = require("./event");
var types_1 = require("./types");
var spawnSync = require('child_process').spawnSync;
var path = require('path');
var SCRIPT_DIR = path.join(isDev ? path.join(__dirname, '..') : process.resourcesPath, 'scripts');
var Playback = /** @class */ (function (_super) {
    __extends(Playback, _super);
    function Playback() {
        var _this = _super.call(this) || this;
        _this.isWindows = !!process.platform.match(/^win/);
        _this.isPlaying = false;
        setInterval(function () {
            _this.runTransportScript(function (data) {
                var _a;
                if (data || _this.isPlaying) {
                    var track = void 0;
                    try {
                        track = JSON.parse(data);
                    }
                    catch (e) {
                        track = data;
                    }
                    if (!track) {
                        if (_this.isPlaying) {
                            _this.isPlaying = false;
                            _this.emit(types_1.EventName.STOP, _this.prevTrack);
                            _this.prevTrack = undefined;
                        }
                        return;
                    }
                    if (!_this.isPlaying) {
                        if (_this.prevTrack && track.position !== _this.prevTrack.position) {
                            _this.isPlaying = true;
                            _this.emit(types_1.EventName.START, track);
                        }
                    }
                    else if (((_a = _this.prevTrack) === null || _a === void 0 ? void 0 : _a.name) !== data.name) {
                        _this.emit(types_1.EventName.STOP, _this.prevTrack);
                        _this.emit(types_1.EventName.START, track);
                    }
                    else if (_this.prevTrack && track.position === _this.prevTrack.position) {
                        _this.isPlaying = false;
                        _this.emit(types_1.EventName.PAUSE, track);
                    }
                    else {
                        _this.emit(types_1.EventName.SEEK, track);
                    }
                    _this.prevTrack = track;
                }
                else {
                    _this.emit(types_1.EventName.STOP, _this.prevTrack);
                }
            });
        }, 1000);
        return _this;
    }
    Playback.prototype.runTransportScript = function (callback) {
        var scriptPath = this.isWindows
            ? path.join(SCRIPT_DIR, 'windows', 'iTunes.js')
            : path.join(SCRIPT_DIR, 'mac', 'ITunesTransport.scpt');
        // : path.join(SCRIPT_DIR, 'mac', 'ChromeTransport.scpt');
        if (!callback) {
            return;
        }
        try {
            var result = this.isWindows
                ? spawnSync('cscript', ['//Nologo', scriptPath])
                : spawnSync('osascript', [scriptPath], { shell: true });
            var data = null;
            if (typeof result.stdout === 'string') {
                try {
                    data = JSON.parse(result.stdout);
                }
                catch (_e) {
                    data = result.stdout;
                }
            }
            else if (result.stdout instanceof Buffer) {
                var parsed = (new TextDecoder()).decode(result.stdout).trim();
                try {
                    data = JSON.parse((new TextDecoder()).decode(result.stdout).trim());
                }
                catch (e) {
                    data = parsed;
                }
            }
            callback(data);
        }
        catch (e) {
            callback(null);
        }
    };
    Playback.prototype.currentTrack = function (callback) {
        this.runTransportScript(callback);
    };
    return Playback;
}(event_1["default"]));
var playBack = new Playback();
exports["default"] = playBack;
