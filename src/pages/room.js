import React, {useState,useEffect} from 'react';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5000";


export const Room =()=>{

  const [response, setResponse] = useState({});

  useEffect(() => {
  
    const socket = socketIOClient(ENDPOINT);
    // connection with server
    socket.on('connection', function(){
    console.log('Connected to Server');
    
    });

    // message listener from server
    socket.on('newMessage', function(message){
        console.log(message);
        setResponse(message);
    });
    

 
  }, []);


  return(

    <div>
        {response.text}
        
    </div>

  )




}