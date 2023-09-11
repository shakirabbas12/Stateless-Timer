"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisJsonDao = void 0;
class RedisJsonDao {
    constructor(redisClient, type) {
        this.redisClient = redisClient;
        this.type = type;
    }
    save(id, value) {
        this.redisClient.setJsonWithSet(this.type, id, value);
    }
    findById(id) {
        return new Promise(async (resolve) => {
            let data = await this.redisClient.getJson(this.getKey(id));
            resolve(data);
        });
    }
    updateField(id, path, value) {
        return this.redisClient.setJson(this.getKey(id), path, value);
    }
    deleteById(id) {
        return this.redisClient.delJsonWithSet(this.type, id);
    }
    deleteAll() {
        return this.redisClient.delAllJsonForType(this.type);
    }
    getKey(id) {
        return `${this.type}:${id}`;
    }
}
exports.RedisJsonDao = RedisJsonDao;
