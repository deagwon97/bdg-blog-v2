import { Header } from 'components/header'
import styles from 'pages/chat/chat.module.scss'
import Footer from 'components/footer'
import io from 'socket.io-client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'
import { Button, TextField } from '@mui/material'
import { getRandomName } from 'tools/randomName'
import { get } from 'http'

type ChatMessage = {
  userName: string
  message: string
}

let socket: Socket | null = null

export default function ChatPage() {
  const messageBoxRef = useRef<HTMLDivElement | null>(null)
  const [input, setInput] = useState('')
  const [userName, setUserName] = useState('')
  const [chatMessageList, setChatMessageList] = useState<ChatMessage[]>([])

  const sendChat = () => {
    if (input === '') {
      return
    }
    if (socket === null) {
      socketInitializer()
      return
    }
    socket.emit('input-change', {
      userName: userName,
      message: input
    } as ChatMessage)
    setInput('')
  }

  useEffect(() => {
    socketInitCallback()
  }, [userName])

  const socketInitCallback = useCallback(async () => {
    if (userName === '') {
      return
    }
    await socketInitializer()
  }, [userName])

  const socketInitializer = async () => {
    console.log('socketInitializer')
    await fetch('/api/socket')
    socket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io',
      transports: ['websocket'],
      secure: process.env.NODE_ENV === 'production'
    }) as Socket

    socket.emit('input-change', {
      userName: 'notice',
      message: `${userName}님이 입장했습니다.`
    } as ChatMessage)

    socket.on('update-input', (msg) => {
      console.log('recieved!!')
      setChatMessageList((chatMessageList) => [...chatMessageList, msg])
    })
  }

  useEffect(() => {
    setUserName(getRandomName())
  }, [])

  const scrollToBottom = () => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight
    }
  }
  useEffect(() => {
    scrollToBottom()
  }, [chatMessageList])

  return (
    <>
      <Header isMain={false} />

      <div className={styles.background}>
        <div>
          <div>
            <div className={styles.chatBox} ref={messageBoxRef}>
              {chatMessageList.map((log, idx) => {
                return log.userName === userName ? (
                  <div key={idx} className={styles.myChat}>
                    {log.message}
                  </div>
                ) : log.userName === 'notice' ? (
                  <div key={idx} className={styles.noticeChat}>
                    {log.message}
                  </div>
                ) : (
                  <div key={idx} className={styles.otherChat}>
                    {log.userName}:{log.message}
                  </div>
                )
              })}
            </div>
            <div className={styles.textWithButtonBox}>
              <TextField
                id="standard-basic"
                variant="standard"
                value={input || ''}
                inputProps={{
                  autoComplete: 'off'
                }}
                style={{ width: '300px' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendChat()
                  }
                }}
                onChange={(e) => {
                  setInput(e.target.value)
                }}></TextField>
              <Button
                onClick={() => {
                  sendChat()
                }}
                style={{
                  height: '2.5em',
                  float: 'right'
                }}>
                전송
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
