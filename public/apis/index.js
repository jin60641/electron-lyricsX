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
exports.openPreference = exports.stopMusic = exports.pauseMusic = exports.seekMusic = exports.startMusic = void 0;
var uuid_1 = require("uuid");
var parse_1 = require("../utils/parse");
var regex_1 = require("../utils/regex");
var _163_1 = require("./163");
var qq_1 = require("./qq");
var Kuroshiro = require('kuroshiro')["default"];
var KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');
var kuroshiro = new Kuroshiro();
var kuromojiAnalyzer = new KuromojiAnalyzer();
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, kuroshiro.init(kuromojiAnalyzer)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
var startMusic = function (win, data) { return __awaiter(void 0, void 0, void 0, function () {
    var lyricRes, filteredLyrics, lyrics;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all([qq_1["default"](data), _163_1["default"](data)])];
            case 1:
                lyricRes = _a.sent();
                filteredLyrics = lyricRes
                    .reduce(function (a, b) { return __spreadArrays(a, b); })
                    .filter(function (lyric) { return (lyric === null || lyric === void 0 ? void 0 : lyric.length) && regex_1.timeTagRegex.test(lyric); });
                return [4 /*yield*/, Promise.all(filteredLyrics.map(function (lyric) { return __awaiter(void 0, void 0, void 0, function () {
                        var ret;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Promise.resolve((lyric.split('\n')).reduce(function (arr, row) { return __awaiter(void 0, void 0, void 0, function () {
                                        var matches, timestamp, text, item, _a;
                                        var _b;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0:
                                                    matches = row.match(regex_1.timeTagRegex);
                                                    if (!matches) {
                                                        return [2 /*return*/, arr];
                                                    }
                                                    if (regex_1.filterRegex.test(row)) {
                                                        return [2 /*return*/, arr];
                                                    }
                                                    timestamp = matches[0];
                                                    text = row.replace(timestamp, '').replace('/\r/', '');
                                                    _b = {
                                                        timestamp: timestamp,
                                                        time: parse_1.timeTagToTimestamp(timestamp)
                                                    };
                                                    if (!text) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, kuroshiro.convert(text, { mode: 'furigana', to: 'hiragana' })];
                                                case 1:
                                                    _a = _c.sent();
                                                    return [3 /*break*/, 3];
                                                case 2:
                                                    _a = '';
                                                    _c.label = 3;
                                                case 3:
                                                    item = (_b.text = _a,
                                                        _b.id = uuid_1.v4(),
                                                        _b);
                                                    return [4 /*yield*/, arr];
                                                case 4: return [2 /*return*/, (_c.sent()).concat([item])];
                                            }
                                        });
                                    }); }, Promise.resolve([])))];
                                case 1:
                                    ret = _a.sent();
                                    return [2 /*return*/, ret];
                            }
                        });
                    }); }))];
            case 2:
                lyrics = _a.sent();
                win.webContents.send('MUSIC.START_MUSIC', lyrics.map(function (lyric) { return (__assign(__assign({}, data), { lyric: lyric })); }));
                return [2 /*return*/];
        }
    });
}); };
exports.startMusic = startMusic;
var seekMusic = function (win, data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        win.webContents.send('MUSIC.SEEK_MUSIC', data);
        return [2 /*return*/];
    });
}); };
exports.seekMusic = seekMusic;
var pauseMusic = function (win) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        win.webContents.send('MUSIC.PAUSE_MUSIC', '');
        return [2 /*return*/];
    });
}); };
exports.pauseMusic = pauseMusic;
var stopMusic = function (win) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        win.webContents.send('MUSIC.STOP_MUSIC', '');
        return [2 /*return*/];
    });
}); };
exports.stopMusic = stopMusic;
var openPreference = function (win) {
    win.webContents.send('LAYOUT.SET_PREFERENCE', '');
};
exports.openPreference = openPreference;
