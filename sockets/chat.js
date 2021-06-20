let img="https://ik.imagekit.io/hbj42mvqwv/1608022759434_Karan_Singh_avatar_atJQ233GU.png";
const formatMessage = require('../messages');
const Chat = require('../model/chat') 
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
  } = require("../utils");

const chatSocket = (io) => { 
    io.of("/chat").on('connection', socket => {
        socket.on('joinRoom', ({ userId, room,username }) => { 
         console.log("userId",userId); 
         console.log(userId, room, username)
          const user = userJoin(socket.id, username, room,userId);
          console.log("connected")
          socket.join(user.room); 
          // Welcome current user
          console.log(user) 
            
          // Send users and room info
          socket.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
          });
        });
      
        // Listen for chatMessage
        socket.on('chatMessage', msg => {
          const user = getCurrentUser(socket.id);
          console.log(user);
          console.log(msg)
            
          socket.emit("message",formatMessage(user.username, msg)); 
          socket.broadcast.to(user.room).emit('message',formatMessage(user.username, msg)) 
          let  chatMessage  =  new Chat({ message: msg, userId: user.userId,roomId:user.room,username:user.username});
            chatMessage.save();
            console.log("chat",chatMessage)
        });
      
        // Runs when client disconnects
        socket.on('disconnectRoom', () => {
          const user = userLeave(socket.id);
      
          if (user) {
            io.to(user.room).emit(
              'message',
              formatMessage(botName, `${user.username} has left the chat`,img)
            );
      
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
              room: user.room,
              users: getRoomUsers(user.room)
            });
          }
        });
      }); 
}

module.exports = chatSocket;