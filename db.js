const mongoose=require('mongoose');
const Schema=mongoose.Schema
const objectId=Schema.Types.ObjectId;

const User=new Schema({
    username: { type:String, required:true},
    password: { type:String, required:true},
    socketid: {type:String}
})

const UserModel=mongoose.model('users-data',User)
module.exports=UserModel;