import React, {Component} from 'react' 
import './index.css'
import  socketIOClient  from "socket.io-client";
import axios from 'axios'
import {API_ROOT} from '../../config.json'
import { toast } from 'react-toastify';

const socket = socketIOClient(`${API_ROOT}/chat`);
function Other({data}){ 
    return(<>
        <div className="other-message message">
            <img src="https://ik.imagekit.io/hbj42mvqwv/1608022759434_Karan_Singh_avatar_atJQ233GU.png" /> 
            <div className="message-content">
                {data.message}
            </div>
        </div> 
    </>)
}
function User({data}){  
    return(
        <div className="user-message message">
            <img src="https://ik.imagekit.io/hbj42mvqwv/1608022759434_Karan_Singh_avatar_atJQ233GU.png" /> 
            <div className="message-content">
                {data.message}
            </div>
        </div>
    )
}
class ChatBox extends Component{
    constructor(props){
        super(props)
        this.state={
            newMessage: '',
            chats: []
        }
        this.sendMessage = this.sendMessage.bind(this)
    }
    async componentDidMount(){ 
        console.log(this.props)
        let obj =  {userId:localStorage.getItem('user'), room:this.props.history.history.location.state.room._id, username: "user"}
        console.log(obj)
        socket.emit('joinRoom', obj)
        socket.on('message',  (message) => {
            //  console.log("MESSAGE")
             this.fetchChats()
          });
        
        // socket.on('roomUsers', async data => {
        //     // console.log("ok", data)
        //     await this.props.fetchData()
        // })

        await this.fetchChats() 
    }  
    async fetchChats(){ 
        await axios.get(`${API_ROOT}/fetchChats/${this.props.history.location.state.room._id}`).then(async res => {
             
            this.setState({
                chats: res.data.chats
            })
             document.getElementById('messagesBody').scrollTop = document.getElementById("messagesBody").scrollHeight
        }) 
    }
    onChange = (e) => {
        this.setState({
            newMessage: e.target.value
        })
    }
    async sendMessage(e){
        e.preventDefault()
        if(this.state.newMessage !== ''){
            await socket.emit('chatMessage', this.state.newMessage);
            await this.fetchChats()
            this.setState({newMessage: ''})
        }
    }
    render(){
        const userData = JSON.parse(localStorage.getItem('iplUser'))
        return(
            <div id="game_body"> 
                <div class="wrapper clearfix" style={{background: '#b9a6a6',height:'600px', width:'600px', borderRadius:'24px 0 24px 25px'}}>
                    <div className="login-container" style={{width:'100%', height:'100%'}}>
                        <div className="chat-box">  
                            <div className="messages" id="messagesBody">
                                {
                                    this.state.chats.map((chat, i) => {
                                        if(chat.userId === localStorage.getItem('user')){
                                            return <User data={chat} key={i} />
                                        }
                                        else return <Other data={chat} key={i} />
                                    })
                                }
                            </div>
                            <div>
                                <form  className="message-input" onSubmit={this.sendMessage}>
                                    <input value={this.state.newMessage} onChange={this.onChange} type="text" placeholder="Type a message here ...." />
                                    <img src={"https://ik.imagekit.io/hbj42mvqwv/download_9Ta8hd1vOa.png"} onClick={this.sendMessage}/>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
} 
export default ChatBox