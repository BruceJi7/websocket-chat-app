import ReactDOM from 'react-dom'
import React, { useState, useEffect } from 'react'

import Identicon from 'react-identicons'

import { w3cwebsocket as W3CWebSocket } from "websocket"



import { Card, Avatar, Input, Typography } from 'antd'
import 'antd/dist/antd.css'
import "./index.css"
// import Search from 'antd/lib/input/Search'

const { Search } = Input
const { Text } = Typography
const { Meta } = Card



const client = new W3CWebSocket('ws://192.168.100.133:8000')

export default function App() {


    const [ userName,       setUserName     ] = useState('')
    const [ isLoggedIn,     setLoggedIn     ] = useState(false)
    const [ messages,       setMessages     ] = useState([])
    const [ messageValue,   setMessageValue ] = useState('')
    const [ identicon,      setIdenticon    ] = useState(null)

    function onLogIn (value) {
        const UTCtime = () => {
            const d = new Date()
            return d.toUTCString()
        }
        console.log(UTCtime())

        const identicon = <Identicon string={userName+UTCtime()}/>
        
        setUserName(value)
        setLoggedIn(true)
        setIdenticon(identicon)
    }

    function onButtonClick (msg) {
        client.send(JSON.stringify({
            type:'message',
            msg:msg,
            user: userName
        }))
        // setMessages('')
        setMessageValue('')
    }

    useEffect(() =>{

        client.onopen = () => {
            console.log('WebSocket Client Connected')
        }

        client.onmessage = (message) => {

            const dataFromServer = JSON.parse(message.data)

            console.log('Received response from server: ', dataFromServer)
            if (dataFromServer.type === "message") {
                console.log(messages)
                const currentMessages = messages
                console.log('Received message: ', message)
                setMessages(
                                [...currentMessages,
                                    {
                                        msg: dataFromServer.msg,
                                        user: dataFromServer.user
                                     }
                                ]
                            )
                console.log(messages)
                }

            }
 
    })

    let mainContent = null

    let enterMessageBox = 
        <section className="bottom">
            
            <Search
                placeholder="Enter message"
                enterButton="Send"
                value={messageValue}
                size="large"
                onChange={(e)=> setMessageValue(e.target.value)}
                onSearch={value=> onButtonClick(value)}
            />
        </section>

    if (isLoggedIn) {

        if (messages.length > 0) {
           
            mainContent = 
            
                <>
                        
                    <div className="title">

                        <Text type="secondary" style={{fontSize: '36px'}}>Websocket Chat App</Text>

                    </div>

                    <div className="message-block">

    
                        {messages.map(message => {


                            const cardUserClass = message.user === userName ? "own-message" : "other-message"
                            const avatarIcon = identicon ? identicon : message.user[0].toUpperCase()+message.user[1].toLowerCase()

                            return (  
                                <Card key={message.msg} className={'message-card ' + cardUserClass}>
                                    <Meta
                                    
                                        avatar={ <Avatar className="avatar">{avatarIcon}</Avatar> }
                                        title={message.user}
                                        description={message.msg}

                                    />
                                </Card>
                            )
                        })}
                    </div>

                   {enterMessageBox} 
            
                </>

        } else { // USER LOGGED IN, NO MESSAGES

            mainContent = 
                <>
                    <section style={{marginTop:100}}>
                        Start a conversation!
                    </section>
                    {enterMessageBox}
                </>
            

        }

    } else { // USER NOT LOGGED IN

        mainContent = 
            <div style={{padding:'200px 40px'}}>
                    <Search
                        placeholder="Enter A Username"
                        enterButton="Sign in"
                        size="large"
                        onSearch={value => onLogIn(value)}
                    />
            </div>
        

    
    }


    return (
        <main className="main">
            {mainContent}
        </main>
        )
}

ReactDOM.render(<App />, document.getElementById('root'))

