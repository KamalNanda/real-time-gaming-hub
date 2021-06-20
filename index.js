const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose') 
const cors = require("cors");
const routes = require("./routes/routes")
const app = express() 
const gameSocket = require("./sockets/game");
const chatSocket = require("./sockets/chat");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
gameSocket(io)
chatSocket(io)

app.use(cors())
app.use((req,res,next)=>{
    res.setHeader('Acces-Control-Allow-Origin','*');
    res.setHeader('Acces-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Acces-Contorl-Allow-Methods','Content-Type','Authorization');
    next(); 
})
app.use(bodyParser.json())

app.use('/' ,routes)
mongoose.connect('mongodb+srv://kamal:kamal@cluster0.uftn9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' , {useNewUrlParser : true , useUnifiedTopology: true })
.then(()=> {
server.listen(2000, ()=>{console.log(`A Node.Js API is linstening on port 2000`)})   
})
.catch(err => console.log(err))
