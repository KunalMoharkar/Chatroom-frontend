import React, {useState,useEffect} from 'react';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5000";



export const Room =()=>{


  const [socket,setSocket] = useState({});
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [response, setResponse] = useState({});
  const [messageQueue, setMessageQueue] = useState([]);


  useEffect(() => {
  
    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);

    socket.on('receive-message', (message)=>{
      
      console.log(message);
      setMessageQueue(state => [...state, message])

    })

    socket.on('room-joined')


 
  }, []);


  const joinRoom = (evt) =>{

    socket.emit('join-room',{
      username: userName,
      roomId: roomId,
    });

    evt.preventDefault();

  }



  const handleSubmit = (evt) => {

    
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });
  
    console.log('sending room request to server')

    //socket.emit('create-new-room',{name:name});

    console.log('sending message to server')

    socket.emit('send-message',{id:socket.id,from:userName,text:name,roomId:roomId});

    evt.preventDefault();
  
  }
  

  

  return(

    <div>
    
      {messageQueue.map((message)=>{

          return(
            <div>
              {message.text}
            </div>
          )

      })}

    <form onSubmit={handleSubmit}>
      <label>
        Message:
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <input type="submit" value="Send" />
    </form>
    
    <form onSubmit={joinRoom}>
      <label>
        Username:
        <input
          type="text"
          value={userName}
          onChange={e => setUserName(e.target.value)}
        />
      </label>
      <label>
        Room code:
        <input
          type="text"
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        />
      </label>
      <input type="submit" value="Join Room" />
    </form>
  
    </div>

  )




}