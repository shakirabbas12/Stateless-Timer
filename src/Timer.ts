import { TimerEntityRepository } from "./repository/TimerEntityRepository";
import { DelayedMessageProducer } from "./jms/DelayedMessageProducer";
import { Redis } from 'ioredis';
import { TimerEntity } from "./Model/TimerEntity";
import { ExpiryHandler } from "./ExpiryHandler";
// import 'reflect-metadata';

export class Timer {
     private readonly repository!:  TimerEntityRepository;
     private readonly delayedMessageProducer!: DelayedMessageProducer;
     private expiryHandler!: ExpiryHandler;
     private client: any;
     private callback:any;
     constructor(JedisPool:Redis ,client:any,queue: string,callback:any ){
      this.client=client;
      this.repository = new TimerEntityRepository(JedisPool, queue + "-timer");
      this.delayedMessageProducer = new DelayedMessageProducer(this.client, queue);
      this.callback=callback;
     // Create a channel
      client.subscribe({ destination: queue, ack: 'auto' }, (error:any, message:any) => {
        if (error) {
          console.error('Failed to subscribe:', error.message);
          return;
        }

        // Handle received message
        message.readString('utf-8', (error :any , body: any) => {
          if (error) {
            console.error('Failed to read message:', error.message);
            return;
          }
          // Call the message listener function
          this.messageListener(body, message.headers.type,message.headers.id);
          //this.messageListener(message);
        });
      });     
  }
  public async start(id: string, delay: number, type: string, data: any): Promise<void> {
    try{
      if (delay < 0) {
        console.log('Delay value is less than 0, ignoring start timer request');
        return;
      }
  
      const timerId: string = this.getJsonKey(id, type);
      let timerresponse =await this.repository.findById(timerId);
      let timerEntity=JSON.parse(timerresponse);
      //if we start new timer then go into that condition
      if (!timerEntity) {
        if (delay === 0) {
          this.callExpiryHandler(type, data);
          return;
        }
        timerEntity = new TimerEntity(timerId, delay,data);
        await this.repository.save(timerId, timerEntity);
        this.delayedMessageProducer.produce(id,type, data, timerEntity);
      }
    }
    catch(e:any)
    {
      console.log(e.message);
      console.log(e.stack);
    }
   
  }
  public getTimerData(id: string, type: string): Promise<TimerEntity | null> {
    return new Promise(async (resolve) => {
      let a=await this.repository.findById(this.getJsonKey(id, type));
      if(a != null)
      {
          console.log("Your Timer data is",a);
          resolve(a);
          return a
      }else
      {
          console.log("Your Timer not in redis");
          return null;
      }
    });
 
   
  }
  public isRunning(id: string, type: string): Promise<boolean> {
    //return !!this.repository.findById(this.getJsonKey(id, type));
    return new Promise(async (resolve) => {
      let a=await this.repository.findById(this.getJsonKey(id, type));
      if(a != null)
      {
          console.log("Your Timer is Still running");
          return true
      }else
      {
          console.log("Your Timer is remove from  redis");
          return false;
      }
     // resolve(data)
    });

    // const a=this.repository.findById(this.getJsonKey(id, type))
 
   
  }

  public stop(id: string, type: string): void {
    
      this.repository.deleteById(this.getJsonKey(id, type));
    
  }

  public setExpiryHandler(expiryHandler: ExpiryHandler): void {
    this.expiryHandler = expiryHandler;
  }
   messageListener = async (message: any | null,type:any,id:string) => {
    try {
      if(message){
      const timerId = type; // retrieve JMSType from STOMP headers
      const timerMessage = JSON.parse(message); 
      const redisresponse =await this.repository.findById(timerId);
      const timerEntity=JSON.parse(redisresponse);
    if (!timerEntity || timerMessage.id !== timerEntity.delayedMessageId) {
      console.debug(`Timer: ${timerId} with dMessageId: ${timerMessage.id} is dispensable, ignoring it`);
      return;
      }
      timerMessage['id']=id;
    this.repository.deleteById(timerId);
    this.callExpiryHandler(timerMessage.type, timerMessage.data);
    this.callback(timerMessage);
   }  
  } catch (e:any) {
      console.log(e.message);
      console.log(e.stack);
    }
  };
  private callExpiryHandler(type: string, data: any): void {
    if (this.expiryHandler != null) {
      this.expiryHandler.handle(type, data);
    }
  }
  
  private getJsonKey(id: string, type: string): string {
    return type + "-" + id;
  }
  
}
