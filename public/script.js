


const socket=io();

const username=localStorage.getItem('username');
const token=localStorage.getItem('token');

if(!token || !username)
{console.log("token & username not received yet");
}


socket.emit('register',token)

async function send(){
const recipientUserName=document.querySelector('.input-username').value;
const message=document.getElementById('description').value;
const sender=username;

console.log('sending message:',recipientUserName,message,sender);

const data={message,recipientUserName,sender}
socket.emit('chat-message',data)

}



socket.on('private-message',(data)=>{
const{sender,message}=data;
const div = document.createElement('div');
try{
div.innerHTML=
`<div>
    <p>user:${sender}</p>
    <p>message:${message}</p>
</div>`
  document.querySelector('.reciving-container').appendChild(div);
}
catch(err){
    console.log(err);
}
})
 //