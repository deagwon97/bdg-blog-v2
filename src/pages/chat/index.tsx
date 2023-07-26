import { Header } from 'components/header'
import styles from 'pages/chat/chat.module.scss'

import io from 'socket.io-client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'
import { Button, TextField } from '@mui/material'
import { getRandomName } from 'tools/randomName'

type ChatMessage = {
  type: string
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
    socket.emit('client-server-chat', {
      type: 'chat',
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
    await fetch('/api/socket')
    socket = io('', {
      path: '/socket.io',
      transports: ['websocket'],
      secure: process.env.NODE_ENV === 'production'
    }) as Socket

    socket.emit('client-server-chat', {
      type: 'notice',
      userName: userName,
      message: `${userName}님이 입장했습니다.`
    } as ChatMessage)

    socket.on('server-client-chat', (msg) => {
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

  const [isSend, setIsSend] = useState(false)
  const toggleSend = () => {
    setIsSend(!isSend)
  }

  const inputTextRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (inputTextRef.current !== null) {
      inputTextRef.current.autocomplete = 'off' //input 비활성화 해제
      inputTextRef.current.disabled = false //input 비활성화 해제
      inputTextRef.current.focus() //input에 focus
    }
  }, [isSend])

  return (
    <div id="chat">
      <Header />
      <div className={styles.background} ref={messageBoxRef}>
        <div>
          <div className={styles.chatBox}>
            {chatMessageList.map((log, idx) => {
              return log.type === 'notice' ? (
                <div key={idx} className={styles.noticeChat}>
                  <hr />
                  {log.message}
                  <hr />
                </div>
              ) : log.userName !== userName ? (
                <div key={idx} className={styles.otherChat}>
                  {log.userName}:{log.message}
                </div>
              ) : (
                <div key={idx} className={styles.myChat}>
                  {log.message}
                </div>
              )
            })}
          </div>
          <div className={styles.textWithButtonBox}>
            <TextField
              id="standard-basic"
              variant="standard"
              sx={{
                color: 'grey'
              }}
              style={{
                width: 'calc(100% - 30px)'
              }}
              inputRef={inputTextRef}
              autoFocus={true}
              type="search"
              value={input || ''}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendChat()
                }
              }}
              onChange={(e) => {
                setInput(e.target.value)
              }}></TextField>
            <Button
              sx={{
                color: 'black'
              }}
              onClick={() => {
                sendChat()
                toggleSend()
              }}
              style={{
                height: '2.5em',
                width: '30px',
                float: 'right'
              }}>
              전송
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
