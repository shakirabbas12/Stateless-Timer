 import { RedisJsonDao } from '../redis/RedisJsonDao';
import { RedisClientImpl } from '../redis/RedisClientImpl';
import { TimerEntity } from '../Model/TimerEntity';
export class TimerEntityRepository extends RedisJsonDao<TimerEntity> {
//    jedisPool: any ;
//     collection: string =''
    constructor(jedisPool: any, collection: string) {
        super(new RedisClientImpl(jedisPool), collection);       
    }
}