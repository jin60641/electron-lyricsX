"use strict";
exports.__esModule = true;
var main_1 = require("./main");
var preference_1 = require("./preference");
var createWindows = function () { return ({
    main: main_1["default"](),
    preference: preference_1["default"]()
}); };
exports["default"] = createWindows;
