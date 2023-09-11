import { TimerEntity } from '../Model/TimerEntity';
import { TimerMessage } from '../Model/TimerMessage';
import { TimerType } from '../Model/TimerType';
import * as stompit from 'stompit';

export class DelayedMessageProducer {
  private client: any;
  private queueName: string;

  constructor(client: any, queueName: string) {
    this.client = client;
    this.queueName = queueName;
  }
  public async produce(id:string,type: string, data: object, timerEntity: TimerEntity): Promise<void> {
    const headers = {
      destination: this.queueName,
      "content-type": "text/plain",
      'AMQ_SCHEDULED_DELAY': timerEntity.getDelay() * 1000,
      'type': timerEntity.getId(),
      'id':id,
  };

  const message = JSON.stringify(new TimerMessage(timerEntity.getDelayedMessageId(), type, data));
  //const message = JSON.stringify(new TimerMessage(id, type, data));
  this.client.send(headers, message, function (error:any) {
      if (error) {
          console.error(`Error while sending an event to active MQ topic [ERROR MESSAGE] :%o${error.message}`);
      } else {
          console.log("Event published successfully");
          console.log(`Timer: ${timerEntity.getId()} started with delay: ${timerEntity.getDelay()} | dMessageId: ${timerEntity.getDelayedMessageId()}`);
      }
  });
  }
}
