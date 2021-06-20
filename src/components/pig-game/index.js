import React, {Component} from 'react'
import './style.css'
import dice1 from '../../assets/dice-1.png'
import dice2 from '../../assets/dice-2.png'
import dice3 from '../../assets/dice-3.png'
import dice4 from '../../assets/dice-4.png'
import dice5 from '../../assets/dice-5.png'
import dice6 from '../../assets/dice-6.png'
import  socketIOClient  from "socket.io-client";
import {API_ROOT} from '../../config.json'
import { toast } from 'react-toastify';
const socket = socketIOClient(`${API_ROOT}`);
export default class PigGame extends Component{
    constructor(props){
        super(props)
        this.state = {
            p1Score : 0,
            p2Score : 0,
            scores: [0,0],
            p1Current:0,
            p2Current:0,
            isYouPlaying: true,
            activePlayer: 0,
            roundScore: 0,
            gamePlaying: true
        } 
    }
    componentDidMount(){
        this.init()
        socket.emit('join-room', {roomId : this.props.history.location.state.room._id, userId : localStorage.getItem('user')})
        socket.on('playerJoined', async (data) => {
            console.log(data)
            if(data.playerObj.userId === localStorage.getItem('user')){
                this.setState({
                    player: data.playerObj
                }) 
            } 
        })
        socket.on('gameOver', ({data}) => {
            data.winner === localStorage.getItem('user')
                ? toast.success("YOU WIN!!!", {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  })
                : 
                toast.error("YOU LOSS!!!", {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }); 
                this.props.history.history.push('/profile')
        })
        socket.on('actiontaken' , ({data}) => {
            const {action, playerId} = data
            if(action !== 'hold'){
                const diceDom= document.querySelector('.dice');  
                diceDom.style.display= 'block';
                diceDom.src= action=== 1 ? dice1 : action===2 ? dice2 : action===3?dice3: action===4?dice4 : action===5 ? dice5 : dice6
                if(playerId === this.state.player._id){
                    if(action === 1){
                        this.setState({p1Current : 0, isYouPlaying:false})
                        this.nextPlayer(1)
                        document.querySelector('.player-0-panel').classList.remove('active');
                        document.querySelector('.player-1-panel').classList.add('active');
                    } else{
                        let p1Current = this.state.p1Current + action
                        this.setState({
                            p1Current,
                            isYouPlaying:true,
                            activePlayer: 0
                        })
                        try{
                            document.querySelector('.player-1-panel').classList.remove('active');
                            document.querySelector('.player-0-panel').classList.add('active');
                        } catch(err){ console.log(err)}
                        
                    }
                } else{
                    if(action === 1){
                        this.setState({p2Current : 0, isYouPlaying: true})
                        this.nextPlayer(1)
                        document.querySelector('.player-1-panel').classList.remove('active');
                        document.querySelector('.player-0-panel').classList.add('active');
                    } else{
                        let p2Current = this.state.p2Current + action
                        this.setState({
                            p2Current,
                            activePlayer : 1,
                            isYouPlaying: false
                        })
                        try{
                            document.querySelector('.player-0-panel').classList.remove('active');
                            document.querySelector('.player-1-panel').classList.add('active');
                        } catch(err){ console.log(err)}
                    }
                }
            } else{
                if(playerId === this.state.player._id){
                    let p1Score = this.state.p1Score + this.state.p1Current
                    const diceDom= document.querySelector('.dice');  
                    this.setState({
                        p1Score,
                        p1Current: 0
                    })
                    if(p1Score >= this.props.history.location.state.room.rounds){
                        document.querySelector('#name-' + this.state.activePlayer).textContent='Winner!'; 
                        diceDom.style.display='none';
                        try{
                            document.querySelector('.player-0-panel').classList.remove('active');
                            document.querySelector('.player-1-panel').classList.remove('active');
                        } catch(err){console.log(err)}
                        document.querySelector('.player-' + this.state.activePlayer + '-panel').classList.add('winner');     
                        socket.emit('gameOver', {roomId:this.props.history.location.state.room._id, winnerId : localStorage.getItem('user') })
                        this.setState({
                            gamePlaying: false,
                            isYouPlaying:false
                        })
                    } else{
                        this.setState({
                            isYouPlaying:false
                        })
                        this.nextPlayer();
                        document.querySelector('.player-0-panel').classList.remove('active');
                        document.querySelector('.player-1-panel').classList.add('active');
                    } 
                } else{
                    let p2Score = this.state.p2Score + this.state.p2Current
                    const diceDom= document.querySelector('.dice');  
                    this.setState({
                        p2Score,
                        p2Current:0
                    })
                    if(p2Score >= this.props.history.location.state.room.rounds){
                        document.querySelector('#name-' + this.state.activePlayer).textContent='Winner!'; 
                        diceDom.style.display='none';
                        try{
                            document.querySelector('.player-0-panel').classList.remove('active');
                            document.querySelector('.player-1-panel').classList.remove('active');
                        } catch(err){console.log(err)}
                        
                        document.querySelector('.player-' + this.state.activePlayer + '-panel').classList.add('winner');     
                        this.setState({
                            gamePlaying: false,
                            isYouPlaying: false
                        })
                    } else{
                        this.setState({
                            isYouPlaying: true
                        })
                        this.nextPlayer();
                        document.querySelector('.player-1-panel').classList.remove('active');
                        document.querySelector('.player-0-panel').classList.add('active');
                    }
                }
            }
        })
        // socket.on('actiontaken', (data) => {
        //     console.log(data)
        //     if(data.data.action === 'hold'){
        //         if(data.data.playerId !== this.state.player._id){
        //             const diceDom= document.querySelector('.dice');  
        //             let oppScore = this.state.oponentScore + this.state.oponentCurrent
        //             this.setState({oponentScore : oppScore})
        //             this.state.scores[this.state.activePlayer] = this.state.scores[this.state.activePlayer] + this.state.oponentCurrent;
        //             document.querySelector('#score-' + this.state.activePlayer).textContent = oppScore;
                    
        //             let loserScore = document.querySelector('#score-' + `${this.state.activePlayer === 0 ? 1 : 0}`).innerHTML;
        //             if(this.state.scores[this.state.activePlayer] >= 20){
        //                 document.querySelector('#name-' + this.state.activePlayer).textContent='Winner!'; 
        //                 diceDom.style.display='none';
        //                 document.querySelector('.player-' + this.state.activePlayer + '-panel').classList.toggle('active');
        //                 document.querySelector('.player-' + this.state.activePlayer + '-panel').classList.add('winner');     
        //                 this.setState({
        //                     gamePlaying: false
        //                 })
        //             }
        //             else{
        //                 this.nextPlayer();
        //             }
        //         } 
        //     }
        //     else{
        //         if(data.data.playerId !== this.state.player._id){
        //             const diceDom= document.querySelector('.dice');  
        //             diceDom.style.display= 'block';
        //             diceDom.src= data.data.action=== 1 ? dice1 : data.data.action===2 ? dice2 : data.data.action===3?dice3: data.data.action===4?dice4 : data.data.action===5 ? dice5 : dice6
        //             if(data.data.action === 1) {
        //                 this.nextPlayer(1);
        //                 this.setState({
        //                     oponentCurrent: 0
        //                 })
        //             } else{
        //                 let roundScore = this.state.oponentCurrent + data.data.action;
        //                 this.setState({
        //                     oponentCurrent: roundScore
        //                 })
        //             } 
        //         }
        //     } 
        //     // this.handSelect(data.data.action , data.data.playerId)
        // })
    }
    // onRollClick = () => {
    //     if(this.state.gamePlaying){
    //         var dice = Math.floor(Math.random() * 6) + 1; 
    //         const diceDom= document.querySelector('.dice');  
    //         diceDom.style.display= 'block';
    //         diceDom.src= dice === 1 ? dice1 : dice===2 ? dice2 : dice===3?dice3: dice===4?dice4 : dice===5 ? dice5 : dice6
    //         this.onRoll(dice)
    //         if(dice !== 1){
    //             let roundScore = this.state.roundScore + dice;
    //             this.setState({
    //                 roundScore
    //             })
    //             document.querySelector('#current-' + this.state.activePlayer).textContent = roundScore 
    //         }   
    //         else{
    //             this.setState({
    //                 roundScore:0
    //             })
    //             this.nextPlayer(1);
    //         }
    //     }
    // }
    // onHoldClick = () => {
    //     if(this.state.gamePlaying){
    //         this.onHold()
    //         const diceDom= document.querySelector('.dice');  
    //         let myScore = this.state.myScore + this.state.roundScore;
    //         this.setState({myScore})
    //         document.querySelector('#score-' + this.state.activePlayer).textContent = myScore
            
    //         let loserScore = document.querySelector('#score-' + `${this.state.activePlayer === 0 ? 1 : 0}`).innerHTML;
    //         if(this.state.scores[this.state.activePlayer] >= 20){
    //             document.querySelector('#name-' + this.state.activePlayer).textContent='Winner!'; 
    //             diceDom.style.display='none';
    //             document.querySelector('.player-' + this.state.activePlayer + '-panel').classList.toggle('active');
    //             document.querySelector('.player-' + this.state.activePlayer + '-panel').classList.add('winner');     
    //             this.setState({
    //                 gamePlaying: false
    //             })
    //         }
    //         else{
    //             this.setState({
    //                 roundScore:0
    //             })
    //             this.nextPlayer();
    //         }
    //     }
    // }
    
    onRoll = (eleId) => {
        socket.emit('action', {roomId : this.props.history.location.state.room._id, action: eleId , playerId : this.state.player._id})
    }
    onHold = () => {
        socket.emit('action', {roomId : this.props.history.location.state.room._id, action: 'hold' , playerId : this.state.player._id})
    }
    onRollClick = () => {
        var dice = Math.floor(Math.random() * 6) + 1; 
        this.onRoll(dice)
    }
    nextPlayer = (dice) => {
        const diceDom= document.querySelector('.dice');  
        this.state.activePlayer === 0 ? this.setState({activePlayer: 1}) : this.setState({activePlayer: 0})
        this.setState({roundScore: 0})
        document.querySelector('#current-0').textContent = '0'; 
        document.querySelector('#current-1').textContent = '0'; 
        if(!dice){
            diceDom.style.display='none';
        } 
    }
    init = () => {  
        const diceDom= document.querySelector('.dice'); 
        diceDom.style.display='none';  
        // document.getElementById('name-0').innerHTML=localStorage.getItem("p1") ? localStorage.getItem("p1") : "Player 1"
        // document.getElementById('name-1').innerHTML=localStorage.getItem("p2") ? localStorage.getItem("p2") : "Player 2"  
    }
    render(){
        return(
            <div id="game_body"> 
                <div class="wrapper clearfix">
                    <div class="player-0-panel active">
                        <div class="player-name" id="name-0">ME</div>
                        <div class="player-score" id="score-0">{this.state.p1Score}</div>
                        <div class="player-current-box">
                            <div class="player-current-label">Current</div>
                            <div class="player-current-score" id="current-0">{this.state.p1Current}</div>
                        </div>
                    </div>
                    
                    <div class="player-1-panel">
                        <div class="player-name" id="name-1">OPPONENT</div>
                        <div class="player-score" id="score-1">{this.state.p2Score}</div>
                        <div class="player-current-box">
                            <div class="player-current-label">Current</div>
                            <div class="player-current-score" id="current-1">{this.state.p2Current}</div>
                        </div>
                    </div>
                     {
                         this.state.gamePlaying
                            ? <>
                                <button style={{color: !this.state.isYouPlaying ? 'grey' : 'black'}} disabled={this.state.isYouPlaying ? false : true } class="btn-roll" onClick={() => this.onRollClick()}><i class="ion-ios-loop"></i>Roll dice</button>
                                <button style={{color: !this.state.isYouPlaying ? 'grey' : 'black'}} disabled={this.state.isYouPlaying ? false : true }  class="btn-hold" onClick={() =>this.onHold()}><i class="ion-ios-download-outline"></i>Hold</button>
                            </>
                            : <></>
                     }
                    
                    
                    <img src={dice6} alt="Dice" class="dice" />
                </div>
            </div>
        )
    }
}