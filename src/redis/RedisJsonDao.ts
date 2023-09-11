
import { RedisClient } from './RedisClient';
export class RedisJsonDao<T>{
    private readonly redisClient: RedisClient;
    private readonly type: string;
    constructor(redisClient:  RedisClient, type: string) {
        this.redisClient = redisClient
        this.type = type
    }
    public save(id: string, value: T) {
         this.redisClient.setJsonWithSet(this.type, id, value);

    }

   public findById(id: string): Promise<any>{
    return new Promise(async (resolve) => {
        let data=await this.redisClient.getJson(this.getKey(id))
        resolve(data)
      });
    }
    

    public updateField(id: string, path: string, value: any): boolean {
        return this.redisClient.setJson(this.getKey(id), path, value);
    }

    public deleteById(id: string): Promise<boolean> {
        return this.redisClient.delJsonWithSet(this.type, id);
    }

    public deleteAll(): Promise<boolean> {
        return this.redisClient.delAllJsonForType(this.type);
    }

    private getKey(id: string): string {
        return `${this.type}:${id}`;
    }

}
