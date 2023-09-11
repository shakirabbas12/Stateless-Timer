"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerEntity = void 0;
const uuid_1 = require("uuid");
class TimerEntity {
    constructor(id, delay, data) {
        this.id = '';
        this.id = id;
        this.delayedMessageId = (0, uuid_1.v4)();
        this.delay = delay;
        this.data = data;
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getDelayedMessageId() {
        return this.delayedMessageId;
    }
    setDelayedMessageId(value) {
        this.delayedMessageId = value;
    }
    getDelay() {
        return this.delay;
    }
    setDelay(delay) {
        this.delay = delay;
    }
    getData() {
        return this.data;
    }
    setData(data) {
        this.data = data;
    }
}
exports.TimerEntity = TimerEntity;
