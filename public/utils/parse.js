"use strict";
exports.__esModule = true;
exports.timeTagToTimestamp = void 0;
var regex_1 = require("./regex");
var timeTagToTimestamp = function (str) {
    var matches = str.match(regex_1.timeTagRegex);
    if (!matches) {
        return 0;
    }
    var _a = matches
        .slice(1, 4)
        .filter(function (data) { return data !== undefined; })
        .reverse()
        .map(Number), _b = _a[0], ms = _b === void 0 ? 0 : _b, _c = _a[1], ss = _c === void 0 ? 0 : _c, _d = _a[2], mm = _d === void 0 ? 0 : _d;
    return mm * 60 + ss + ms * 0.01;
};
exports.timeTagToTimestamp = timeTagToTimestamp;
