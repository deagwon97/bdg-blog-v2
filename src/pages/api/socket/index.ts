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
    if (!io) {
      io = new Server(res.socket.server)
    }
    res.socket.server.io = io
    let userName = ''
    io.on('connection', async (socket) => {
      socket.on('input-change', (msg) => {
        userName = msg?.userName as string
        redisPub.publish(
          'send-user-data',
          JSON.stringify({
            ...{
              message: msg
            }
          })
        )
      })

      socket.on('disconnect', () => {
        console.log('disconnected')
        redisPub.publish(
          'send-user-data',
          JSON.stringify({
            ...{
              message: {
                type: 'notice',
                userName: userName,
                message: `${userName}님이 나갔습니다.`
              }
            }
          })
        )
        socket.disconnect()
        return
      })

      if (!redisSub) {
        redisSub = await getRedisSub()
        redisSub.on('message', (_, message) => {
          const redisMessage = JSON.parse(message)
          socket.broadcast.emit('update-input', redisMessage.message)
        })
      }
    })
  }
  res.end()
}

export default SocketHandler
