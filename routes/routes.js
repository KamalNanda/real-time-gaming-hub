
const express= require('express') 
const userControllers = require('../controllers/auth') 
const roomControllers = require('../controllers/room') 
const router = express.Router() 
const Chat = require('../model/chat')
router.get('/' , (req , res , next)=> {
    res.json("Gaming Hub!!!")
}) 

// USERS ROUTES 

router.post('/auth/signup' , userControllers.signUp)
router.post('/auth/login' , userControllers.login)
router.get('/auth/users', userControllers.getUsers) 
router.get('/auth/:userId', userControllers.getUserById) 


// USERS ROUTES 

// ROOM ROUTES

router.post('/room/create', roomControllers.createRoom)
router.put('/room/join', roomControllers.joinRoom)
router.get('/room/roomcode', roomControllers.fetchRoomByRoomCode)
router.get('/room/:roomId', roomControllers.fetchRoomById)
router.get('/room/user/:userId', roomControllers.fetchRoomByUserId)
router.get('/fetchChats/:roomId', async function(req,res){ 
    let roomId=req.params.roomId;
    let chats
    try{
        chats=await Chat.find({roomId});
    }catch(err){console.log(err)}
    
    res.send({chats : chats.length !== 0 ? chats : [] });
    //let users= [...new Set(chats.map(x => x.userId))];
  }) 


// ROOM ROUTES




module.exports = router
