import { Redis } from 'ioredis'

const globalRedis = globalThis as unknown as {
  redisPub: Redis | undefined
  redisSub: Redis | undefined
}

export const redisPub =
  globalRedis.redisPub ??
  new Redis({
    host: process.env.NEXT_PUBLIC_REDIS_HOST
  })

export const getRedisSub = async () => {
  if (globalRedis.redisSub) {
    return globalRedis.redisSub
  } else {
    globalRedis.redisSub = new Redis({
      host: process.env.NEXT_PUBLIC_REDIS_HOST
    })
    await globalRedis.redisSub.subscribe('bdg-chat-user-data', (err, count) => {
      if (err) {
        console.log(`error: Subscribed to ${count} channels. ${err}`)
      }
    })
    return globalRedis.redisSub
  }
}
