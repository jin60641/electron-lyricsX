"use strict";
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
exports.__esModule = true;
var axios_1 = require("axios");
var searchLyric = function (mid) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, axios_1["default"].get('https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg', {
                params: {
                    songmid: mid,
                    g_tk: 5381,
                    nobase64: 1,
                    format: 'json',
                    platform: 'yqq.json',
                    needNewCode: 0
                },
                headers: { referer: 'https://c.y.qq.com/portal/player.html' }
            })];
    });
}); };
var searchMusic = function (info) { return __awaiter(void 0, void 0, void 0, function () {
    var res, ids, lyrics, lyricRes;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, axios_1["default"].get('https://c.y.qq.com/soso/fcgi-bin/client_search_cp', {
                    params: {
                        offset: 0,
                        limit: 10,
                        type: 1,
                        s: info.artist + " " + info.name
                    }
                })];
            case 1:
                res = _d.sent();
                ids = (_c = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.results) === null || _b === void 0 ? void 0 : _b.songs) === null || _c === void 0 ? void 0 : _c.map(function (_a) {
                    var id = _a.id;
                    return id;
                });
                lyrics = [];
                if (!ids) return [3 /*break*/, 3];
                return [4 /*yield*/, Promise.all(ids.map(searchLyric))];
            case 2:
                lyricRes = _d.sent();
                lyrics = lyricRes
                    .filter(function (_a) {
                    var _b;
                    var data = _a.data;
                    return !!((_b = data === null || data === void 0 ? void 0 : data.lrc) === null || _b === void 0 ? void 0 : _b.lyric);
                })
                    .map(function (_a) {
                    var lyric = _a.data.lrc.lyric;
                    return lyric;
                });
                _d.label = 3;
            case 3: return [2 /*return*/, lyrics];
        }
    });
}); };
exports["default"] = searchMusic;
