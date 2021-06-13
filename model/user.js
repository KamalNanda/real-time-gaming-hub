const mongoose = require('mongoose') 
const Schema = mongoose.Schema

const userSchema = new Schema({
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }, 
    rank : {
        type : Number,
        default: 0
    }, 
    roomsList : {
        type : Array,
        default: []
    }, 
    totalScore : {
        type : Number,
        default: 0
    }

})

module.exports = mongoose.model("User" , userSchema)
