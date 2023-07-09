import { redisClient } from './redisClient';


export const setValue = async (key: string, value: string) => {
    return await redisClient.set(key, value);
}

export const getValue = async (key: string) => {
    return await redisClient.get(key);
}