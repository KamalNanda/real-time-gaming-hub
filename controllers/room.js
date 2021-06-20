const Room = require('../model/room') 
const {generateRandom,fetchUsers,fetchRooms} = require('../utils')
const User = require('../model/user')

const createRoom = async (req , res , next) => {
    console.log(req.body)
    const {roomname, gameType, createdBy, rounds} = req.body
    let roomcodeGen = generateRandom(4)
    let roomcode = roomname.slice(0,4) + roomcodeGen
    let isRoomCodeExist, creator, users
    try{
        isRoomCodeExist = Room.findOne({roomcode})
        creator = await User.findById(createdBy)
    } catch(err){
        console.log(err)
        return next(err)
    }
    if(isRoomCodeExist) {
        roomcodeGen = generateRandom(5)
        roomcode = roomname.slice(0,4) + roomcodeGen
    }
    const newRoom = new Room({
        roomname,
        roomcode,
        gameType, 
        rounds,
        createdBy,
        playerList : [createdBy]
    })
    creator.roomsList = [...creator.roomsList, newRoom._id ]
    try {
        await newRoom.save()
        await creator.save()
    } catch(err){
        console.log(err)
        return next(err)
    }
    users = await fetchUsers(newRoom.playerList)
    res.status(201).json({room : {...newRoom, users }, message:'Room Created'})
}

const fetchRoomById = async (req, res, next) => {
    const {roomId} = req.params
    let room, users 
    try{
        room = await Room.findById(roomId)
    } catch (error){ 
        next (error)
        return res.status(500).json({message: "Fetching Room Failed! Try Later "})
    }
    // users = await fetchUsers(room.playerList)
    res.status(200).json({room : {...room}})
}

const fetchRoomByRoomCode = async (req, res, next) => {
    const {roomCode} = req.body
    let room, users
    try{
        room = await Room.findOne({roomCode})
    } catch (error){ 
        next (error)
        return res.status(500).createRoomjson({message: "Fetching Room Failed! Try Later "})
    }
    if(!room) return res.status(404).json({message: "Room not found with the given room code"})
    users = await fetchUsers(room.playerList)
    res.status(200).json({room : {...room, users}})
}

const joinRoom = async (req, res, next) => {
    const {roomcode, userId} = req.body 
    let room, user 
    try{
        room = await Room.findOne({roomcode})
        user = await User.findById(userId)
    } catch (error) {
        console.log(err)
        return next(err) 
    } 
    if(!room) return res.status(404).json({isJoined: false, message: "Room not found with the given room code"})
    users = await fetchUsers(room.playerList)
    if(room.playerList.includes(userId)) return res.status(200).json({room : {...room, users}}) 
    if(room.playerList.length == 2) return res.status(400).json({isJoined: false, message: "Sorry, You Can't Join! Room is Full!"})
    room.playerList = [...room.playerList , userId]
    user.roomsList = [...user.roomsList, room._id ]
    try {
        await room.save()
        await user.save()
    } catch(err){
        console.log(err)
        return next(err)
    }
    res.status(201).json({message: "User joined the Room", isJoined : true, room: {...room, users: [...users, user]}})
}

const fetchRoomByUserId = async (req, res, next) => {
    const {userId} = req.params
    let rooms, user 
    try{
        user = await User.findById(userId)
    } catch (error){ 
        next (error)
        return res.status(500).createRoomjson({message: "Fetching Room Failed! Try Later "})
    }
    rooms = await fetchRooms(user.roomsList)
    res.status(200).json({rooms})
}

exports.createRoom = createRoom
exports.joinRoom = joinRoom
exports.fetchRoomByRoomCode = fetchRoomByRoomCode
exports.fetchRoomById = fetchRoomById
exports.fetchRoomByUserId = fetchRoomByUserId