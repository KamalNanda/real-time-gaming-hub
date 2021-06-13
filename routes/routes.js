
const express= require('express') 
const userControllers = require('../controllers/auth') 
const roomControllers = require('../controllers/room') 
const router = express.Router() 

router.get('/' , (req , res , next)=> {
    res.json("Gaming Hub!!!")
}) 

// USERS ROUTES 

router.post('/auth/signup' , userControllers.signUp)
router.post('/auth/login' , userControllers.login)
router.get('/auth/users', userControllers.getUsers) 


// USERS ROUTES 

// ROOM ROUTES

router.post('/room/create', roomControllers.createRoom)
router.put('/room/join', roomControllers.joinRoom)
router.get('/room/roomcode', roomControllers.fetchRoomByRoomCode)
router.get('/room/:roomId', roomControllers.fetchRoomById)
router.get('/room/:userId', roomControllers.fetchRoomByUserId)

// ROOM ROUTES




module.exports = router
