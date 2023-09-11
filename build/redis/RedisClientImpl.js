"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClientImpl = void 0;
const ioredis_1 = require("ioredis");
const JSON_ROOT_PATH = ".";
class RedisClientImpl {
    constructor(redis) {
        this.redis = redis;
    }
    assertReplyOk(str) {
        if (str !== "OK") {
            throw new Error(str);
        }
    }
    assertReplyNotError(str) {
        if (str.startsWith("-ERR")) {
            console.log("error");
            throw new Error(str.substring(5));
        }
    }
    setJson(key, path, object) {
        if (object === undefined) {
            return this.setJson(key, JSON_ROOT_PATH, Object);
        }
        else {
            try {
                const value = JSON.stringify(object);
                const status = this.redis.sendCommand(new ioredis_1.Command("SET", [key, path, value]));
                if (status === "OK") {
                    this.assertReplyOk(status);
                }
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        }
    }
    setJsonWithSet(type, id, object) {
        this.redis.set(this.getKey(type, id), JSON.stringify(object), (err, succ) => {
            if (err) {
                console.error("Error while setting hash [ERROR] :%o", err, {
                    className: "redis.service",
                    methodName: "setCCUserHash",
                });
                //reject(err);
            }
            else {
                //resolve(succ);
            }
        });
    }
    async setAllJsonForType(type, idList, objectList) {
        let transaction = null;
        try {
            transaction = this.redis.multi();
            for (let i = 0; i < idList.length; i++) {
                const id = idList[i];
                const object = objectList[i];
                transaction.sadd(type, id);
                const value = JSON.stringify(object);
                transaction.sendCommand(new ioredis_1.Command('SET', [this.getKey(type, id), JSON_ROOT_PATH, value]));
            }
            await transaction.exec();
            return true;
        }
        catch (error) {
            if (transaction !== null) {
                transaction.discard();
            }
            console.error(error);
            return false;
        }
    }
    async setMultiJsonWithSet(type, jsonObjects) {
        let transaction = null;
        try {
            transaction = this.redis.multi();
            for (const [id, value] of jsonObjects) {
                transaction.sadd(type, id);
                const data = JSON.stringify(value);
                transaction.sendCommand(new ioredis_1.Command('SET', [this.getKey(type, id), data]));
            }
            await transaction.exec();
            return true;
        }
        catch (error) {
            if (transaction) {
                transaction.discard();
            }
            console.error(error);
            return false;
        }
    }
    getJson(key) {
        return new Promise((resolve, reject) => {
            this.redis.get(key, (err, succ) => {
                if (err) {
                    resolve(null);
                }
                else {
                    try {
                        resolve(succ);
                    }
                    catch (err) {
                        resolve(null);
                    }
                }
            });
        });
    }
    async getJsonArray(key, clazz) {
        const response = await this.redis.get(key);
        if (response !== null) {
            this.assertReplyNotError(response);
            const jsonArray = JSON.parse(response);
            return jsonArray;
        }
        else {
            return [];
        }
    }
    async multiGetJson(clazz, ...keys) {
        const responseList = [];
        const args = keys.flatMap(key => [key, JSON_ROOT_PATH]);
        const rep = await this.redis.multi()
            .mget(...args)
            .exec();
        if (rep != null) {
            for (const object of rep[0]) {
                if (object != null) {
                    responseList.push(JSON.parse(JSON.stringify(object)));
                }
            }
        }
        return responseList;
    }
    async delJson(key) {
        const response = await this.redis.sendCommand(new ioredis_1.Command('DEL', [key, JSON_ROOT_PATH]));
        return parseInt(JSON.stringify(response));
    }
    delJsonWithSet(type, id) {
        this.redis.del(this.getKey(type, id), function (err, response) {
            if (response == 1) {
                console.log('Timer is successfully remove from Redis:', response);
            }
            else {
                console.error('Transaction error:', err);
            }
        });
    }
    async delAllJsonForType(type) {
        let transaction = null;
        try {
            const idList = await this.redis.smembers(type);
            if (idList == null) {
                return false;
            }
            transaction = this.redis.multi();
            for (const id of idList) {
                transaction.del(this.getKey(type, id), JSON_ROOT_PATH);
            }
            transaction.del(type);
            await transaction.exec();
            return true;
        }
        catch (e) {
            if (transaction != null) {
                transaction.discard();
            }
            console.error(e);
        }
        return false;
    }
    setAdd(key, member) {
        return this.redis.sadd(key, member);
    }
    setMembers(key) {
        return this.redis.smembers(key);
    }
    setRem(key, ...member) {
        return this.redis.srem(key, member);
    }
    async set(key, value) {
        const status = await this.redis.set(key, value);
        if (status === "OK") {
            this.assertReplyOk(status);
        }
        if (status !== 'OK') {
            throw new Error(`Failed to set value for key "${key}"`);
        }
    }
    async get(key) {
        const value = await this.redis.get(key);
        return value;
    }
    async del(key) {
        try {
            return await this.redis.del(key);
        }
        finally {
        }
    }
    async exists(key) {
        const result = await this.redis.exists(key);
        return result === 1;
    }
    scan(cursor, params) {
        return this.redis.scan(cursor, params);
    }
    getKey(type, id) {
        return `${type}:${id}`;
    }
}
exports.RedisClientImpl = RedisClientImpl;
