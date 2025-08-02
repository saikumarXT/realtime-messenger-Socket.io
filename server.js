const express=require('express');
const app=express();
const bcrypt=require('bcrypt');

app.use(express.json());

app.post('/signup',async function(req,res){
const username=req.body.username;
const password=req.body.password;

try{
const hashedValue=await bcrypt.hash(password,2)
UserModel.create({
    username:username,
    password:hashedValue
})
}
catch(err){
res.json({
    message:err.message
     })
}


})