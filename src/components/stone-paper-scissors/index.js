import React, {Component} from 'react' 
import stone from '../../assets/stone.png'
import './index.css'
import paper from '../../assets/paper.png'
import scissors from '../../assets/scissors.png'
import  socketIOClient  from "socket.io-client";
import {API_ROOT} from '../../config.json'
import { toast } from 'react-toastify';
const socket = socketIOClient(`${API_ROOT}`);
let timer
export default class PigGame extends Component{
    constructor(props){
        super(props)
        this.state = {
            CPU_hand : 0,
            PLAYER_hand : 0,
            scores: [0,0],
            CPU:0,
            PLAYER:0, 
            activePlayer: 0,
            roundScore: 0,
            gamePlaying: true,
            time: 5
        } 
    } 
    componentDidMount(){ 
        
        this.timerInit()
        socket.emit('join-room', {roomId : this.props.history.location.state.room._id, userId : localStorage.getItem('user')})
        socket.on('playerJoined', async (data) => {
            console.log(data)
            if(data.playerObj.userId === localStorage.getItem('user')){
                this.setState({
                    player: data.playerObj
                })
                console.log(this.state.player)
            }
            console.log(this.state.player)
            
             
        }  )
        socket.on('actiontaken', ({data}) => {
            const {action, playerId} = data 
            this.handSelect(action , playerId)
        })
    }
    timerInit = () =>{
        timer =setInterval(() => {
            if(this.state.time === 1) clearInterval(timer) 
                this.setState({time : this.state.time -1})  
        }, 1000)
    }
    componentDidUpdate(){
        if(this.state.time <=0){

        }
    }
    onHandClick = (eleId) => {
        socket.emit('action', {roomId : this.props.history.location.state.room._id, action: eleId , playerId : this.state.player._id})
    }
    handSelect = ( eleId, pID) => {
        var playerContainer = document.getElementById('player-hand-container');
        var cpuContainer = document.getElementById('cpu-hand-container'); 
        var cpuPoint = document.getElementById('cpu-point');
        var playerPoint = document.getElementById('player-point'); 
        var result = document.getElementById('WINS');
        var final = document.getElementById('finalResult')
        var hand  
        let CPU_hand = eleId
        let P_hand
        let PLAYER, CPU 
        
        hand = document.getElementById(eleId); 
        if(pID !== this.state.player._id){
            switch(CPU_hand){
                case "stone": cpuContainer.src = stone; break;
                case "paper": cpuContainer.src = paper ; break;
                case "scissors": cpuContainer.src = scissors ; break;
            }

        }
       else{
        P_hand = eleId
        if(eleId == "stone")
        {
            playerContainer.src=stone
            this.setState({
                PLAYER_hand : 1
            }) 
        }
        else if(eleId == "paper")
        {
            playerContainer.src=paper
            this.setState({
                PLAYER_hand : 2
            })
        }
        else if(eleId == "scissors")
        {
            playerContainer.src=scissors
            this.setState({
                PLAYER_hand : 3
            })
        }
       }
        
        if(P_hand == CPU_hand){
            // result.innerText = "TIE"
            toast.error("TIE", {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }); 
        }
        else if(P_hand == "stone" && CPU_hand == "paper"){
            // result.innerText = "CPU"
            let CPU = this.state.CPU + 1;
            this.setState({CPU}) 
            if(CPU == 5){ 
            toast.error("YOU LOSS", {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }); 
            }
        }
        else if(P_hand == 'stone' && CPU_hand == 'scissors'){ 
            let PLAYER = this.state.PLAYER + 1
            this.setState({PLAYER}) 
            if(PLAYER == 5){
                
            toast.success("YOU WON", {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }); 
    
            }
        }
        else if(P_hand == "paper" && CPU_hand == "stone"){ 
            PLAYER = PLAYER + 1 
            if(PLAYER == 5){
                toast.success("YOU WON", {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }); 
    
            }
        }
        else if(P_hand == "paper" && CPU_hand == "scissors"){ 
            CPU = CPU + 1; 
            if(CPU == 5){
                toast.error("CPU WON", {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }); 
    
            }
        }
        else if(P_hand == "scissors" && CPU_hand == "stone"){
            
            CPU = CPU + 1;
            
            if(PLAYER == 5){
                toast.error("YOU LOSS", {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }); 
    
            }
        }
        else if(P_hand == "scissors" && CPU_hand == "paper"){
             
            PLAYER = PLAYER + 1
             
            if(CPU == 5){
                toast.success("YOU WON", {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }); 
            }
        }
    }
    render(){
        return(
            <div id="game_body"> 
               <div class="wrapper clearfix">
                    <div class="player-0-panel active">
                        <div class="player-name" id="name-0">Player 1</div>
                        <div class="player-score" id="score-0">{this.state.scores[0]}</div>
                        <div class="player-current-box">
                            <div class="player-current-label">Current</div>
                            <div class="hand-select-current" id="scissors" onclick="handSelect(this.id)">
                                <img  id="player-hand-container" />
                            </div>
                        </div>
                    </div>                
                    <div class="player-1-panel">
                        <div class="player-name" id="name-1">Player 2</div>
                        <div class="player-score" id="score-1">{this.state.scores[1]}</div>
                        <div class="player-current-box">
                            <div class="player-current-label">Current</div> 
                            <div class="hand-select-current" id="stone" onclick="handSelect(this.id)">
                                <img   id="cpu-hand-container" />
                            </div>
                        </div> 
                    </div>
                    <div className="hands">
                        <h2 style={{textAlign:'center', marginBottom:'10px'}}>Choose Hand Gesture in {this.state.time}</h2>
                        <div class="hand-select-container" >
                            <div class="hand-select" id="stone" onClick={() => this.onHandClick("stone")}>
                                <img src={stone} />
                            </div>
                            <div class="hand-select" id="paper" onClick={() => this.onHandClick("paper")}>
                                <img src={paper} />
                            </div>
                            <div class="hand-select" id="scissors" onClick={() => this.onHandClick("scissors")}>
                                <img src={scissors}/>
                            </div>
                        </div>
                    </div>
                     
                    {/* <button class="btn-roll" onClick={() => this.onRollClick()}><i class="ion-ios-loop"></i>Roll dice</button>
                    <button class="btn-hold" onClick={() =>this.onHoldClick()}><i class="ion-ios-download-outline"></i>Hold</button> */}
                    
                    {/* <img src={dice6} alt="Dice" class="dice" /> */}
                </div>
            </div>
        )
    }
}