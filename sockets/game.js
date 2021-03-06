const Room = require('../model/room')  
const User = require('../model/user')
const Player = require('../model/player')
const {createPlayer,fetchPlayers} = require('../utils')

const gameSocket = (io) => {
    io.of("/").on("connection", (socket) => {   
        //User Joining Room
        socket.on("join-room", async ({ roomId, userId }) => { 
            console.log(roomId, userId)
            socket.join(roomId);
            const  roomObj = await Room.findById(roomId) 
            if(roomObj.status == 'ENDED'){
                socket.emit('gameOver', roomObj)
            }
            else{
            var playerObj = await createPlayer(roomId, userId);  
            socket.emit("playerJoined",{ playerObj}); 
            socket.broadcast.to(roomId).emit('playerJoined', {playerObj})
            }
        }); 
        //User Joined

        //Asking to start
            socket.on("isReady", async ({roomId}) => {
                socket.to(roomId).emit('isReady')
            })
            socket.on("ready", async ({roomId}) => {
                socket.to(roomId).emit('ready')
            })
        //Asked to start

        //Start Game
            socket.on('startGame', async ({roomId}) => {
                roomObj = await Room.findById(roomId)
                roomObj.status = 'STARTED'
                roomObj.currentRound = 1
                await roomObj.save()
                socket.broadcast.to(roomId).emit('gameStarted', {data : roomObj})
                socket.emit('gameStarted', {data: roomObj})
            })
        //Game Started

        //Actions
            socket.on('action', async ({roomId,action, playerId}) => {  
                socket.broadcast.to(roomId).emit('actiontaken', {data : {action,playerId}})
                socket.emit('actiontaken', {data: {action, playerId}})
            }) 

            socket.on('roundOver', async ({roomId, playerId}) => {
                let playerObj = await Player.findById(playerId)
                let roomObj = await Room.findById(roomId)
                roomObj.currentRound = roomObj.currentRound + 1
                playerObj.score = playerObj.score + 2
                await playerObj.save()
                if(roomObj.currentRound === roomObj.rounds){
                    let players = await fetchPlayers(roomId)
                    let winnerId
                    if(players[0].score > players[0].score) winnerId = players[0]._id
                    else winnerId = players[1]._id
                    roomObj.winner = players[0]._id
                    let winner = await Player.findById(winnerId)
                    winner.isWon = true
                    await winner.save()
                    await roomObj.save()
                    socket.emit('gameOver', {data: {roomObj, winner}}) 
                    socket.broadcast.to(roomId).emit('gameOver', {data : {roomObj, winner}})
                } else { 
                    await roomObj.save()
                }
            })
        //Action Taken

        //Game Over
            socket.on('gameOver', async ({roomId, winnerId}) => {
                roomObj = await Room.findById(roomId)
                userObj = await User.findById(winnerId)
                userObj.totalScore = userObj.totalScore ? userObj.totalScore + 100 : 100
                userObj.rank = userObj.rank + 1
                roomObj.status = 'ENDED'
                roomObj.winner = winnerId
                try{
                    await roomObj.save()
                    await userObj.save()
                } catch(err){
                    console.log(err)
                } 
                socket.broadcast.to(roomId).emit('gameOver', {data : roomObj})
                socket.emit('gameOver', {data: roomObj}) 
            })
        //Game Over

        socket.on('leave' , async ({roomId}) => {
            socket.leave({roomId})
        })
    })
}

module.exports = gameSocket