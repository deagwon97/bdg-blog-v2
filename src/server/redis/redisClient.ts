import { Redis } from 'ioredis'

const globalReisPub = globalThis as unknown as {
  redisPub: Redis | undefined
}
const globalRedisSub = globalThis as unknown as {
  redisSub: Redis | undefined
}

export const redisPub =
  globalReisPub.redisPub ??
  new Redis({
    host: process.env.NEXT_PUBLIC_REDIS_HOST
  })

export const getRedisSub = async () => {
  if (globalRedisSub.redisSub) {
    return globalRedisSub.redisSub
  } else {
    console.log('create redis sub')
    globalRedisSub.redisSub = new Redis({
      host: process.env.NEXT_PUBLIC_REDIS_HOST
    })
    await globalRedisSub.redisSub.subscribe('send-user-data', (err, count) => {
      if (err) {
        console.error(err.message)
        console.log(`error: Subscribed to ${count} channels. ${err}`)
      }
    })
    return globalRedisSub.redisSub
  }
}
