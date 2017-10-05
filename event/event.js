"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
    constructor(operation, name, content) {
        this.timestamp = this.currentTimestamp();
        this.operation = operation;
        this.name = name;
        this.content = content;
    }
    getOperation() {
        return this.operation;
    }
    getTimestamp() {
        return this.timestamp;
    }
    getName() {
        return this.name;
    }
    getContent() {
        return this.content;
    }
    currentTimestamp() {
        var date = new Date();
        var dash = "-";
        var colon = ":";
        var dot = ".";
        return date.getFullYear() + dash +
            this.pad(date.getMonth() + 1) + dash +
            this.pad(date.getDate()) + " " +
            this.pad(date.getHours()) + colon +
            this.pad(date.getMinutes()) + colon +
            this.pad(date.getSeconds()) + dot +
            this.pad(date.getMilliseconds());
    }
    pad(n) {
        return n < 10 ? "0" + n : n;
    }
}
exports.Event = Event;
//# sourceMappingURL=event.js.map