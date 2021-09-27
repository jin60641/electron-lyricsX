"use strict";
exports.__esModule = true;
var types_1 = require("./types");
var events = require('events');
var EventClient = /** @class */ (function () {
    function EventClient() {
        this.eventTarget = new events.EventEmitter();
        this.listeners = [];
    }
    /**
     * Add a event handler
     */
    EventClient.prototype.on = function (eventName, listener) {
        if (!this.isEventName(eventName)) {
            throw new Error('invalid event name');
        }
        if (typeof listener !== 'function') {
            throw new Error('listener must be function');
        }
        this.listeners.push({
            eventName: eventName,
            listener: listener
        });
        return this.eventTarget.on(eventName, listener);
    };
    /**
     * Remove a event handler
     */
    EventClient.prototype.off = function (eventName, listener) {
        if (!this.isEventName(eventName)) {
            throw new Error('invalid event name');
        }
        if (typeof listener !== 'function') {
            throw new Error('listener must be function');
        }
        return this.eventTarget.off(eventName, listener);
    };
    EventClient.prototype.emit = function (eventName, detail) {
        return this.eventTarget.emit(eventName, { detail: detail });
    };
    EventClient.prototype.dispose = function () {
        var _this = this;
        this.listeners.forEach(function (_a) {
            var eventName = _a.eventName, listener = _a.listener;
            _this.eventTarget.off(eventName, listener);
        });
        this.listeners = [];
    };
    EventClient.prototype.isEventName = function (eventName) {
        return Object.values(types_1.EventName).includes(eventName);
    };
    return EventClient;
}());
exports["default"] = EventClient;
