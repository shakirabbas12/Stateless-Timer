"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelayedMessageProducer = void 0;
const TimerMessage_1 = require("../Model/TimerMessage");
class DelayedMessageProducer {
    constructor(client, queueName) {
        this.client = client;
        this.queueName = queueName;
    }
    async produce(id, type, data, timerEntity) {
        const headers = {
            destination: this.queueName,
            "content-type": "text/plain",
            'AMQ_SCHEDULED_DELAY': timerEntity.getDelay() * 1000,
            'type': timerEntity.getId(),
            'id': id,
        };
        const message = JSON.stringify(new TimerMessage_1.TimerMessage(timerEntity.getDelayedMessageId(), type, data));
        //const message = JSON.stringify(new TimerMessage(id, type, data));
        this.client.send(headers, message, function (error) {
            if (error) {
                console.error(`Error while sending an event to active MQ topic [ERROR MESSAGE] :%o${error.message}`);
            }
            else {
                console.log("Event published successfully");
                console.log(`Timer: ${timerEntity.getId()} started with delay: ${timerEntity.getDelay()} | dMessageId: ${timerEntity.getDelayedMessageId()}`);
            }
        });
    }
}
exports.DelayedMessageProducer = DelayedMessageProducer;
