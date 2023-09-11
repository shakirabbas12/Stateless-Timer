"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerMessage = void 0;
class TimerMessage {
    constructor(id, type, data) {
        this.id = id;
        this.type = type;
        this.data = data;
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getType() {
        return this.type;
    }
    setType(type) {
        this.type = type;
    }
    getData() {
        return this.data;
    }
    setData(data) {
        this.data = data;
    }
}
exports.TimerMessage = TimerMessage;
