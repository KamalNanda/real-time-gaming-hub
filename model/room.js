const mongoose = require('mongoose') 
const Schema = mongoose.Schema

const userSchema = new Schema({
    roomname : {
        type : String,
        required : true
    },
    roomcode : {
        type : String,
    }, 
    playerList : {
        type : Array,
        default: []
    }, 
    gameType : {
        type : String,
        required : true
    }, 
    rounds : {
        type : Number, 
        default : 0
    },
    currentRound : {
        type : Number, 
        currentRound : 0
    },
    status : {
        type : String,
        default: 'NEW'
    }, 
    winner : {
        type : String,
        default: ''
    }, 
    createdOn : {
        type : Date,
        default: Date.now()
    },
    createdBy : {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model("Room" , userSchema)
