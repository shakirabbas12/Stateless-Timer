import { TimerType } from "./TimerType";
export class TimerMessage {
    id: string;
   type: string;
   data: object;
  constructor(id: string, type: string, data: object) {
    this.id = id
    this.type = type
    this.data = data
  }
  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getType(): string {
    return this.type;
  }

  public setType(type: string): void {
    this.type = type;
  }

  public getData(): object {
    return this.data;
  }

  public setData(data: object): void {
    this.data = data;
  }

}


