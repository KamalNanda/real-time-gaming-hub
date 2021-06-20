import React, {Component} from 'react'  
import axios from 'axios'
import  socketIOClient  from "socket.io-client";
import {API_ROOT} from '../../config.json'
import { toast } from 'react-toastify';
const socket = socketIOClient(`${API_ROOT}`);
export default class Login extends Component{
    constructor(props){
        super(props)
        this.state = { 
            room: {},
            player:{},
            isReady:false
        } 
    }  
    fetchRoom = async () => {
        await axios.get(`${API_ROOT}/room/${this.props.history.location.state.room._id}`)
            .then(res => {
                this.setState({
                    room : res.data.room._doc
                })
            })
    }
    async componentDidMount(){ 
        await this.fetchRoom()
        socket.emit('join-room', {roomId : this.state.room._id, userId : localStorage.getItem('user')})
        socket.on('playerJoined', async (data) => {
            console.log(data)
            this.setState({
                player: data.playerObj
            })
            if(data.playerObj.userId !== localStorage.getItem('user')) await this.fetchRoom()
        }  )
        socket.on('isReady', () => {
            if(this.state.room?.createdBy !== localStorage.getItem('user')){
                document.getElementById('is-ready').style.display='block'
                toast.success(`The game admin whats to know if you are ready or not`, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });  
            }
            
        }  )
        socket.on('ready', () => {
            if(this.state.room?.createdBy == localStorage.getItem('user')){ 
                toast.success(`The player is ready you can start the game`, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });  
                  this.setState({
                      isReady: true
                  })
            }
            
        }  )
        socket.on('gameStarted', () => { 
                toast.success(`Game Started`, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }); 
                  if(this.state.room.gameType === 'stonepaperscissors') {
                    this.props.history.history.push({
                        pathname : '/stonepaperscissors', 
                        state:{player: this.state.player, room : this.state.room}
                    })
                  } 
                  else {
                    this.props.history.history.push({
                        pathname : '/piggame', 
                        state:{player: this.state.player, room : this.state.room}
                    })
                  }
                  
        }  )
    }
    componentWillUnmount(){
        socket.emit('leave', {roomId: this.state.room._id})
    }  
    askReady = () => {
        socket.emit('isReady', {roomId : this.state.room._id})
    }
    yesReady = () => {
        socket.emit('ready', {roomId : this.state.room._id}) 
    }
    startGame = () => {
        socket.emit('startGame', {roomId : this.state.room._id}) 
    }
    render(){ 
        return(
            <div id="game_body"> 
                <div class="wrapper clearfix" style={{height:'600px', width:'600px'}}>
                    <div className="login-container" style={{width:'80%'}}>
                        <h2 style={{textAlign:'center', marginBottom:'20px'}}>Room Name - {this.state.room?.roomname}</h2> 
                        <h2 style={{textAlign:'center', marginBottom:'20px'}}>Room Code - {this.state.room?.roomcode}</h2> 
                        <h2 style={{textAlign:'center', marginBottom:'20px'}}>Room length - {this.state.room?.playerList?.length}/2</h2> 
                        {   this.state.room.status !== 'ENDED' ?
                            !this.state.isReady
                                ? this.state.room?.createdBy === localStorage.getItem('user')
                                    ? <center onClick={() => this.askReady()}>
                                        <div id="create-room-btn" className="room-btn" onClick={this.onCreateClick}>Ask if Ready</div>
                                    </center>
                                    : <center onClick={() => this.yesReady()} id="is-ready" style={{display:'none'}}>
                                        <h4>Are you ready?</h4>
                                        <div id="create-room-btn" className="room-btn" onClick={this.onCreateClick}>I'm Ready</div>
                                    </center>
                                : this.state.room?.createdBy === localStorage.getItem('user')
                                    ? <center onClick={() => this.startGame()}>
                                        <div id="create-room-btn" className="room-btn" onClick={this.onCreateClick}>Start Game</div>
                                    </center>
                                    : <></>
                                : <><h2 style={{textAlign:'center', marginBottom:'20px'}}>Game Status - Game Ended</h2> </>
                        }
                        <center>
                            <div style={{marginTop:'20px'}} className="login-btn" onClick={() => {
                                this.props.history.history.push({
                                    pathname : '/chat', 
                                    state:{ room : this.state.room}
                                })}}>CHAT</div>
                        </center>
                    </div>
                </div>
            </div>
        )
    }
}