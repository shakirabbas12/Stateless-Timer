import { v4 as uuidv4 } from 'uuid';
export class TimerEntity {
     id: string='';
     delayedMessageId: string;
     delay: number;
     data:any;
   
     constructor( id: string, delay: number,data:any) {
        this.id = id;
        this.delayedMessageId  = uuidv4();
        this.delay = delay
        this.data=data
    }
    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public getDelayedMessageId(): string {
        return this.delayedMessageId;
    }

    public setDelayedMessageId(value: string): void {
        this.delayedMessageId = value;
    }

    public getDelay(): number {
        return this.delay;
    }

    public setDelay(delay: number): void {
        this.delay = delay;
    }
    public getData():any{
        return this.data
    }
    public setData(data: any): void {
        this.data = data;
    }


   
}