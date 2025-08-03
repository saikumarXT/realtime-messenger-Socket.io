const express=require('express');
const http=require('http');
const socketIo=require('socket.io')

const app=express();
const bcrypt=require('bcrypt');
const JWT=require('jsonwebtoken')
const JWT_KEY='crack the jack';
const mongoose=require('mongoose')
const UserModel=require('./db');
const cors=require('cors');   
const path = require('path');
const server=http.createServer(app);
const io=socketIo(server);
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://gsoc:5fDg6O3N3L427Vz7@cluster1.wmja1ig.mongodb.net/")
  
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','login.html'));
});

app.use(express.static(path.join(__dirname, 'public')));


app.post('/signup',async function (req, res){
    const password=req.body.password;
    const username =req.body.username;

      try{ 
    const hashedPassword =await bcrypt.hash(password,5);
    if(hashedPassword){
    await UserModel.create({
    password:hashedPassword,
    username:username
    });
    res.json({ message:"user successful signed-up"})
} 

}
  catch(err){ res.json({  message:err.message }) }  
})


app.post('/signin',async function(req,res){
    const password=req.body.password;
    const username =req.body.username;
try{
    const user=await UserModel.findOne({
        username:username
    })
    const comPassword=await bcrypt.compare(password,user.password);
    if(user && comPassword){
    const token= await JWT.sign({ id:user._id.toString()
    },JWT_KEY);
    res.json({
        token:token,
        username:username
    })
    }
    else{
      res.json({message:"user not found"})
    }
  }

catch(err){
    res.json({ message:err.message })
}
})

app.use((req, res) => {
  res.status(404).send(`❌ Cannot ${req.method} ${req.originalUrl}`);
});


io.on('connection',(socket)=>{

socket.on('register',async(token)=>{
  try{ 
    if(!token){
      console.log('token not found');
      return;
    }
    const decodeData =await JWT.verify(token,JWT_KEY);
    const userid = decodeData.id;
    
    await UserModel.findByIdAndUpdate(userid,{socketid:socket.id})
    console.log('user socket has been updated in the data base');
  }
  catch(err){ console.log(err.message) }
})

socket.on('chat-message',async(data) => {
  const {recipientUserName,message,sender}=data;
  const recipient=await UserModel.findOne({username:recipientUserName})
    if(recipient&&recipient.socketid){
     await io.to(recipient.socketid).emit('private-message',{sender,message})
    }
    else{
      console.log('failed at chat-message-private')
    }
})
})

server.listen(3002,  () => {
    console.log("Server running on http://localhost:3002")
})
