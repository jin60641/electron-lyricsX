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
var event_1 = require("./event");
var types_1 = require("./types");
var spawn = require('child_process').spawn;
var path = require('path');
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
                            _this.emit(types_1.EventName.PAUSE, _this.prevTrack);
                            _this.prevTrack = undefined;
                        }
                        return;
                    }
                    if (track && !_this.isPlaying) {
                        _this.isPlaying = true;
                        _this.emit(types_1.EventName.START, track);
                    }
                    else if (track && _this.isPlaying) {
                        if (((_a = _this.prevTrack) === null || _a === void 0 ? void 0 : _a.name) !== data.name) {
                            _this.emit(types_1.EventName.PAUSE, _this.prevTrack);
                            _this.emit(types_1.EventName.START, track);
                        }
                        else {
                            _this.emit(types_1.EventName.SEEK, track);
                        }
                    }
                    _this.prevTrack = track;
                }
            });
        }, 2000);
        return _this;
    }
    Playback.prototype.runTransportScript = function (callback) {
        var scriptPath = this.isWindows
            ? path.join(__dirname, '..', 'scripts', 'windows', 'iTunes.js')
            // : path.join(__dirname, '..', 'scripts', 'mac', 'ITunesTransport.scpt');
            : path.join(__dirname, '..', 'scripts', 'mac', 'ChromeTransport.scpt');
        var scriptRunner = this.isWindows
            ? spawn('cscript', ['//Nologo', scriptPath])
            : spawn('osascript', [scriptPath]);
        scriptRunner.stdout.on('data', function (data) {
            var result;
            try {
                result = JSON.parse(data);
            }
            catch (e) {
                result = data;
            }
            if (callback) {
                callback(result);
            }
        });
    };
    Playback.prototype.currentTrack = function (callback) {
        this.runTransportScript(callback);
    };
    return Playback;
}(event_1["default"]));
var playBack = new Playback();
exports["default"] = playBack;
