export interface RedisClient {
    setJson(key: string, object: any): boolean;
    setJson(key: string, path: string, object: any): boolean;
    setJsonWithSet(type: string, id: string, object: any):any;
    setAllJsonForType(type: string, idList: string[], objectList: any[]): Promise<boolean>;
    getJson(key: string):Promise<any |null>;
    getJsonArray<T>(key: string, clazz: new () => T[]): Promise<T[]>;
    multiGetJson<T>(clazz: new () => T, ...keys: string[]): Promise<T[]>;
    delJson(key: string): Promise<number>;
    delJsonWithSet(type: string, id: string):any;
    delAllJsonForType(type: string): Promise<boolean>;
    setAdd(key: string, member: string): Promise<number>;
    setMembers(key: string): Promise<string[]>;
    setRem(key: string, ...member: string[]): Promise<number>;
    set(key: string, value: string): Promise<void>;
    get(key: string): Promise<string|null>;
    del(key: string): Promise<number>;
    exists(key: string): Promise<boolean>;
    scan(cursor: string, params: any): Promise<[string, string[]]>;
  }
  