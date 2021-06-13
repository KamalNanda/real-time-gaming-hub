const User = require('../model/user') 


const signUp = async (req , res , next) => {
    console.log(req.body)
    const {username, password} = req.body
    let existingUser
    try{
        existingUser = await User.findOne({username})
    }  catch(err){
        console.log(err)
        return next(err)
    }
    if (existingUser){    
        return res.status(400).json({message : 'User already exist'})
    }
    const newUser = new User({
        username, 
        password 
    })
    try {
        await newUser.save()
    } catch(err){
        console.log(err)
        return next(err)
    }
    res.status(201).json({user: newUser, message:'User Created'})
}
  
const login = async (req, res, next) => {
    const {username , password} = req.body
    let existingUser
    try{
        existingUser = await User.findOne({username})
    }  catch(err){
        console.log(err)
        return next(err)
    } 
    if(!existingUser || existingUser.password !== password){   
        return res.status(404).json({message: "User not found with the given credentials"})
    }
    res.status(200).json({message: "Logged In" , user : existingUser})
}
const getUsers = async (req, res, next) => {
    let users
    try{
        users = await User.find({})
    } catch (error){ 
        next (error)
        return res.status(500).createRoomjson({message: "Fetching Users List Failed! Try Later "})
    }
    res.status(200).json({users})
}

exports.login = login
exports.signUp = signUp
exports.getUsers = getUsers