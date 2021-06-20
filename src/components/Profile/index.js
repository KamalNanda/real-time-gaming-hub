import React, {Component} from 'react'  
import axios from 'axios'
import {API_ROOT} from '../../config.json'
export default class Login extends Component{
    constructor(props){
        super(props)
        this.state = { 
            user: {},
            rooms: []
        } 
    }  
    fetchUser = async () => {
        await axios.get(`${API_ROOT}/auth/${localStorage.getItem('user')}`)
            .then(res => {
                this.setState({
                    user : res.data.user
                })
            })
    }
    fetchRooms = async () => {
        await axios.get(`${API_ROOT}/room/user/${localStorage.getItem('user')}`)
            .then(res => {
                this.setState({
                    rooms : res.data.rooms
                }) 
            })
    }
    componentDidMount(){
        this.fetchUser()
        this.fetchRooms()
    }
    render(){
        console.log(this.props)
        return(
            <div id="game_body"> 
                <div class="wrapper clearfix" style={{height:'600px', width:'600px'}}>
                    <div style={{padding: '20px'}}>
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                            <h2 style={{marginBottom:'20px'}}>Name - {this.state.user?.username}</h2> 
                            <h2 style={{marginBottom:'20px'}}>Rank - {this.state.user?.rank}</h2> 
                            <h2 style={{marginBottom:'20px'}}>Total Score - {this.state.user?.totalScore}</h2> 
                        </div>
                        <h2 style={{textAlign:'center', marginBottom:'20px'}}>Number of Rooms Joined - {this.state.rooms?.length}</h2> 
                        <table style={{width:'100%', margin:'auto', fontSize:'1.20rem'}}>
                            <tr>
                                <th style={{border:'1px solid grey'}}>S.No</th>
                                <th style={{border:'1px solid grey'}}>Name</th>
                                <th style={{border:'1px solid grey'}}>Code</th>
                                <th style={{border:'1px solid grey'}}>Type</th>
                                <th style={{border:'1px solid grey'}}>Status</th>
                                <th style={{border:'1px solid grey'}}>Chat Room</th>
                            </tr>
                            {
                                this.state.rooms?.map((room, index) => {
                                    let status = room.winner != '' ? room.winner === localStorage.getItem('user') ? "YOU WON" : "YOU LOSS" : room.status
                                    return <tr style={{border:'1px solid black'}} key={index} style={{textAlign:'center'}}>
                                                <td style={{border:'1px solid grey'}}>{index}</td>
                                                <td style={{border:'1px solid grey'}}>{room.roomname}</td>
                                                <td style={{border:'1px solid grey'}}>{room.roomcode}</td>
                                                <td style={{border:'1px solid grey'}}>{room.gameType ==="piggame" ? "PIG GAME" :"STONE PAPER SCISSORS"}</td>
                                                <td style={{border:'1px solid grey'}}>{status}</td>
                                                <td style={{border:'1px solid grey'}}>
                                                    <div style={{marginTop:'20px'}} className="login-btn" onClick={() => {
                                                        this.props.history.history.push({
                                                            pathname : '/chat', 
                                                            state:{ room : room}
                                                        })}}>CHAT</div>
                                                </td>
                                            </tr>
                                })
                            }
                        </table>
                    </div>
                </div>
                <h2 className="my-profile">
                    {/* <img width="25px" height="25px" style={{marginRight:'10px'}} src="https://ik.imagekit.io/hbj42mvqwv/1608022759434_Karan_Singh_avatar_atJQ233GU.png"/> */}
                    <span onClick={() => this.props.history.history.push('/menu')}>GO TO HOME</span>
                </h2>
            </div>
        )
    }
}