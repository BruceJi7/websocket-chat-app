import ReactDOM from 'react-dom'
import React, { Component } from 'react'

import { w3cwebsocket as W3CWebSocket } from "websocket"

import { Card, Avatar, Input, Typography } from 'antd'
import 'antd/dist/antd.css'

const { search } = Input



const client = new W3CWebSocket('ws://127.0.0.1:8000')

export default class App extends Component {


    state = {
        userName:'',
        isLoggedIn:false
    }

    onButtonClick = (msg) => {
        client.send(JSON.stringify({
            type:'message',
            msg:msg
        }))
    }

    componentDidMount() {
        client.onopen = () => {
            console.log('WebSocket Client Connected')
        }
        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data)
            console.log('Received response from server: ', dataFromServer)
        }
 
    }


    render() {
        return (
            <div className="main">
                {this.state.isLoggedIn ? 
                <button onClick={() => this.onButtonClick("Heelo")}>SEND DAT MSG </button>
                :
                <div style=

            }
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'))

