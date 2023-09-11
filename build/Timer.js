"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
const TimerEntityRepository_1 = require("./repository/TimerEntityRepository");
const DelayedMessageProducer_1 = require("./jms/DelayedMessageProducer");
const TimerEntity_1 = require("./Model/TimerEntity");
// import 'reflect-metadata';
class Timer {
    constructor(JedisPool, client, queue, callback) {
        this.messageListener = async (message, type, id) => {
            try {
                if (message) {
                    const timerId = type; // retrieve JMSType from STOMP headers
                    const timerMessage = JSON.parse(message);
                    const redisresponse = await this.repository.findById(timerId);
                    const timerEntity = JSON.parse(redisresponse);
                    if (!timerEntity || timerMessage.id !== timerEntity.delayedMessageId) {
                        console.debug(`Timer: ${timerId} with dMessageId: ${timerMessage.id} is dispensable, ignoring it`);
                        return;
                    }
                    timerMessage['id'] = id;
                    this.repository.deleteById(timerId);
                    this.callExpiryHandler(timerMessage.type, timerMessage.data);
                    this.callback(timerMessage);
                }
            }
            catch (e) {
                console.log(e.message);
                console.log(e.stack);
            }
        };
        this.client = client;
        this.repository = new TimerEntityRepository_1.TimerEntityRepository(JedisPool, queue + "-timer");
        this.delayedMessageProducer = new DelayedMessageProducer_1.DelayedMessageProducer(this.client, queue);
        this.callback = callback;
        // Create a channel
        client.subscribe({ destination: queue, ack: 'auto' }, (error, message) => {
            if (error) {
                console.error('Failed to subscribe:', error.message);
                return;
            }
            // Handle received message
            message.readString('utf-8', (error, body) => {
                if (error) {
                    console.error('Failed to read message:', error.message);
                    return;
                }
                // Call the message listener function
                this.messageListener(body, message.headers.type, message.headers.id);
                //this.messageListener(message);
            });
        });
    }
    async start(id, delay, type, data) {
        try {
            if (delay < 0) {
                console.log('Delay value is less than 0, ignoring start timer request');
                return;
            }
            const timerId = this.getJsonKey(id, type);
            let timerresponse = await this.repository.findById(timerId);
            let timerEntity = JSON.parse(timerresponse);
            //if we start new timer then go into that condition
            if (!timerEntity) {
                if (delay === 0) {
                    this.callExpiryHandler(type, data);
                    return;
                }
                timerEntity = new TimerEntity_1.TimerEntity(timerId, delay, data);
                await this.repository.save(timerId, timerEntity);
                this.delayedMessageProducer.produce(id, type, data, timerEntity);
            }
        }
        catch (e) {
            console.log(e.message);
            console.log(e.stack);
        }
    }
    getTimerData(id, type) {
        return new Promise(async (resolve) => {
            let a = await this.repository.findById(this.getJsonKey(id, type));
            if (a != null) {
                console.log("Your Timer data is", a);
                resolve(a);
                return a;
            }
            else {
                console.log("Your Timer not in redis");
                return null;
            }
        });
    }
    isRunning(id, type) {
        //return !!this.repository.findById(this.getJsonKey(id, type));
        return new Promise(async (resolve) => {
            let a = await this.repository.findById(this.getJsonKey(id, type));
            if (a != null) {
                console.log("Your Timer is Still running");
                return true;
            }
            else {
                console.log("Your Timer is remove from  redis");
                return false;
            }
            // resolve(data)
        });
        // const a=this.repository.findById(this.getJsonKey(id, type))
    }
    stop(id, type) {
        this.repository.deleteById(this.getJsonKey(id, type));
    }
    setExpiryHandler(expiryHandler) {
        this.expiryHandler = expiryHandler;
    }
    callExpiryHandler(type, data) {
        if (this.expiryHandler != null) {
            this.expiryHandler.handle(type, data);
        }
    }
    getJsonKey(id, type) {
        return type + "-" + id;
    }
}
exports.Timer = Timer;
