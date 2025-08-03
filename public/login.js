const socket=io();
async function signup(){
const username=document.querySelector('.input-name').value;
const password=document.querySelector('.input-password').value;

try{
const res=await axios.post("http://localhost:3002/signup",{
    username:username,
    password:password
})
alert(res.data.message);
}
catch(err){
    console.log(err);
    }
}

async function signin(){
    const username=document.querySelector('.input-name').value;
    const password=document.querySelector('.input-password').value;
    try{
    const res=await axios.post("http://localhost:3002/signin",{
        username:username,
        password:password
    })

    const data=res.data;
if(data.token&&data.username){
    localStorage.setItem('token',data.token);
    localStorage.setItem('username',data.username);

    socket.emit('register', data.token);
    window.location.href= 'index.html';
    alert('you are signed up successfully');
    }
}
catch(err){
   console.log(err)
}
}