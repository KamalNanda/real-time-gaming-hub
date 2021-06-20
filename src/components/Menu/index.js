import React, {Component} from 'react'   
import './style.css'
import axios from 'axios'
import {API_ROOT} from '../../config.json'
import { toast } from 'react-toastify';
export default class PigGame extends Component{ 
    constructor(props){
        super(props)
        this.state={
            roomcode : '',
            roomname : '',
            gameType : '',
            rounds : 0,
            errorJoin : '',
            errorCreate : ''
        }
    }
    onInputChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    onJoinClick = () => {
        document.getElementById('join-room-btn').style.display = "none"
        document.getElementById('join-room-sec').style.display = "block"
    }
    onCreateClick = () => {
        document.getElementById('create-room-btn').style.display = "none"
        document.getElementById('create-room-sec').style.display = "block"
    }
    onCreateRoomSubmit = (e) => {
        e.preventDefault()
        const { roomname , gameType , rounds } = this.state
        if(roomname == '' || gameType == '' || rounds == 0){
            this.setState({errorCreate : "Please fill all fields"})
        } else{
            this.setState({errorJoin : ""})
            axios.post(`${API_ROOT}/room/create`, {
                roomname,
                gameType, 
                rounds, 
                createdBy: localStorage.getItem('user')
            }).then(res => { 
                toast.success(`${res.data.message}. Generated Room Code - ${res.data.room._doc.roomcode}`, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });  
                  this.props.history.history.push({pathname:'/room', state: {room : res.data.room._doc}})
            }).catch(err => { 
                toast.error("Error - " + err.response.data.message, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }); 
            })
        }
    } 
    onJoomRoomSubmit = (e) => {
        e.preventDefault()
        const { roomcode } = this.state
        if(roomcode == ''){
            this.setState({errorJoin : "Please fill all fields"})
        } else{
            this.setState({errorJoin : ""})
            axios.put(`${API_ROOT}/room/join`, {
                roomcode,
                userId: localStorage.getItem('user')
            }).then(res => { 
                toast.success(res.data.message, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });  
                  this.props.history.history.push({pathname:'/room', state: {room : res.data.room._doc}})
            }).catch(err => { 
                toast.error("Error - " + err.response.data.message, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }); 
            })
        }
    } 
    render(){
        return(
            <div id="game_body"> 
               <div class="wrapper clearfix menu">
                    <div class="player-0-panel active" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                        <div className="room-btn" id="join-room-btn" onClick={this.onJoinClick}>JOIN ROOM</div>
                        <div style={{display:'none'}} id="join-room-sec">
                            <h2 style={{textAlign:'center'}}>JOIN ROOM</h2>
                            <div style={{marginTop:'20px'}}>
                                <label>Enter Room Code</label>
                                <input onChange={this.onInputChange} name="roomcode" type="text" placeholder="Enter your room code"/>
                            </div>
                            <p style={{color:'red', marginTop:'10px', textAlign:'center'}}>{this.state.errorJoin}</p>
                            <center>
                                <div className="login-btn" style={{marginTop:'20px'}} onClick={this.onJoomRoomSubmit}>JOIN</div> 
                            </center>
                        </div> 
                    </div>                
                    <div class="player-1-panel" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                        <div id="create-room-btn" className="room-btn" onClick={this.onCreateClick}>CREATE ROOM</div>
                        <div style={{display:'none'}} id="create-room-sec">
                            <h2 style={{textAlign:'center'}}>CREATE ROOM</h2>
                            <div style={{marginTop:'20px'}}>
                                <label>Enter Room Name</label>
                                <input onChange={this.onInputChange} name="roomname" type="text" placeholder="Enter your room name"/>
                            </div>
                            <div style={{marginTop:'20px'}}>
                                <label>Enter Game Type</label> 
                                <select onChange={this.onInputChange} name="gameType">
                                    <option>Select Game Type</option>
                                    {/* <option value="stonepaperscissors">Stone Paper Scissors</option> */}
                                    <option value="piggame">Pig Game</option>
                                </select>
                            </div>
                            <div style={{marginTop:'20px'}}>
                                <label>Enter Game Rounds</label>
                                <input onChange={this.onInputChange} name="rounds" type="number" placeholder="Enter number of game rounds"/>
                            </div>
                            <p style={{color:'red', marginTop:'10px', textAlign:'center'}}>{this.state.errorCreate}</p>
                            <center>
                                <div className="login-btn" style={{marginTop:'20px'}} onClick={this.onCreateRoomSubmit}>CREATE</div> 
                            </center>
                        </div>  
                    </div>  
                </div>
                <h2 className="my-profile">
                    <img width="25px" height="25px" style={{marginRight:'10px'}} src="https://ik.imagekit.io/hbj42mvqwv/1608022759434_Karan_Singh_avatar_atJQ233GU.png"/>
                    <span onClick={() => this.props.history.history.push('/profile')}>MY PROFILE</span>
                </h2>
            </div>
        )
    }
}