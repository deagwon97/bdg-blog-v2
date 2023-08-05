import { NextApiRequest } from 'next'
import { Server } from 'socket.io'
import { NextApiResponseWithSocket } from 'socket.d'
import { redisPub, getRedisSub } from 'server/chat/golbalRedis'
import Redis from 'ioredis'

let io: Server | null = null
let redisSub: Redis | null = null

const ChatSocketHandler = async (
  _: NextApiRequest,
  res: NextApiResponseWithSocket
) => {
  if (!res.socket.server.io) {
    if (!io) {
      io = new Server(res.socket.server)
    }
    res.socket.server.io = io
    let userName = ''

    // create websocket connection
    // when new client connects
    io.on('connection', async (socket) => {
      // create redis sub
      redisSub = await getRedisSub()

      socket.on('client-server-chat', (msg) => {
        userName = msg?.userName as string
        redisPub.publish(
          'bdg-chat-user-data',
          JSON.stringify({
            ...{
              message: msg
            }
          })
        )
      })

      socket.on('disconnect', () => {
        redisPub.publish(
          'bdg-chat-user-data',
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
      
      redisSub.on('message', (_, message) => {
        const redisMessage = JSON.parse(message)
        socket.emit('server-client-chat', redisMessage.message)
      })
      
    })
  }
  res.end()
}

export default ChatSocketHandler
