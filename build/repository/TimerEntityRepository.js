"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerEntityRepository = void 0;
const RedisJsonDao_1 = require("../redis/RedisJsonDao");
const RedisClientImpl_1 = require("../redis/RedisClientImpl");
class TimerEntityRepository extends RedisJsonDao_1.RedisJsonDao {
    //    jedisPool: any ;
    //     collection: string =''
    constructor(jedisPool, collection) {
        super(new RedisClientImpl_1.RedisClientImpl(jedisPool), collection);
    }
}
exports.TimerEntityRepository = TimerEntityRepository;
