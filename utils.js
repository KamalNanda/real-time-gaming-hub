const User = require('./model/user')
const Room = require('./model/room')
const Player = require('./model/player')

async function generateRandom (length){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function fetchUsers(players){
    var Users = []
    for(let i=0; i< players.length ; i++){
        let singleUser
        singleUser = await User.findById(players[i])
        Users = [...Users, singleUser]
    }
    return Users
}

async function fetchRooms(rooms){
    var Rooms = []
    for(let i=0; i< rooms.length ; i++){
        let singleRoom
        singleRoom = await Room.findById(rooms[i])
        Rooms = [...Rooms, singleRoom]
    }
    return Rooms
}

async function createPlayer(userId, roomId){
    let userObj, playerObj
    try{
        userObj = await User.findById(userId)
        playerObj = await Player.findOne({userId, roomId})
    }catch(err){
        console.log(err)
    } 
    if(playerObj) return playerObj
    playerObj = new Player({
        roomId, 
        userId, 
        playername : userObj.username,
    })
    try{
        await playerObj.save()
    }catch(err){
        console.log(err)
    }
    return playerObj
}

async function fetchPlayers(roomId){
    var Players = []
    Players = await Player.find({roomId})
    return Players
}

module.exports = { 
    generateRandom,
    fetchUsers,
    fetchRooms,
    createPlayer,
    fetchPlayers
};