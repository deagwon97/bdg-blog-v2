import { NextApiRequest } from 'next'
import { Server } from 'socket.io'
import { NextApiResponseWithSocket } from 'socket.d'
import { redisPub, getRedisSub } from 'server/redis/redisClient'
import Redis from 'ioredis'

let io: Server | null = null
let redisSub: Redis | null = null

const SocketHandler = async (
  _: NextApiRequest,
  res: NextApiResponseWithSocket
) => {
  if (!res.socket.server.io) {
    // Socket is initializing...
    if (!io) {
      io = new Server(res.socket.server)
    }
    res.socket.server.io = io
    io.on('connection', async (socket) => {
      socket.on('input-change', (msg) => {
        redisPub.publish(
          'send-user-data',
          JSON.stringify({
            ...{
              message: msg
            }
          })
        )
      })
      if (!redisSub) {
        redisSub = await getRedisSub()
        redisSub.on('message', (_, message) => {
          console.log('received message from redis ')
          const redisMessage = JSON.parse(message)
          socket.broadcast.emit('update-input', redisMessage.message)
        })
      }
    })
  }
  res.end()
}

export default SocketHandler
