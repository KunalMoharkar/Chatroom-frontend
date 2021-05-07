import React, { useState, useEffect } from "react";
import {Card} from "./components/card/card";
import './App.css';

import socketIOClient from "socket.io-client";



const ENDPOINT = "http://127.0.0.1:5000";

export const App = ()=> {

  /*
  const [response, setResponse] = useState("");

  useEffect(() => {

    
    const socket = socketIOClient(ENDPOINT);
        // connection with server
    socket.on('connection', function(){

    console.log('Connected to Server');
    
    });

    // message listener from server
  socket.on('newMessage', function(message){

    console.log(message);

  });
    

 
  }, []);

  */


  return (
    <div className="AppContainer">
      <Card heading="Join Room" text="adssdasdasd"/>
      <Card heading="Join Room" text="adssdasdasd"/>
    </div>
  );
}

export default App;
