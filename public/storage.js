"use strict";
exports.__esModule = true;
var Store = require('electron-store');
var store = new Store();
var storage = {
    getItem: function (key) { return new Promise(function (resolve) {
        resolve(store.get(key));
    }); },
    setItem: function (key, item) { return new Promise(function (resolve) {
        resolve(store.set(key, item));
    }); },
    removeItem: function (key) { return new Promise(function (resolve) {
        resolve(store["delete"](key));
    }); }
};
exports["default"] = storage;
