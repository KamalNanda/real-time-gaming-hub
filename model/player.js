const mongoose = require('mongoose') 
const Schema = mongoose.Schema

const playerSchema = new Schema({
    playername : {
        type : String,
    }, 
    score : {
        type : Number,
        default : 0
    }, 
    roomId : {
        type : String, 
    }, 
    userId : {
        type : String
    },
    isWon : {
        type : Boolean,
        default : false
    }
})

module.exports = mongoose.model("Player" , playerSchema)
