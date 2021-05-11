import React, {useState,useEffect} from 'react';
import socketIOClient from "socket.io-client";
import {Redirect} from 'react-router-dom';
import './room.css';

import {Header}  from '../components/Header/Header'

const ENDPOINT = "http://127.0.0.1:5000";

export const Room =(props)=>{


  //state variable for socket
  const [socket,setSocket] = useState({});
  const [name, setName] = useState("");

  //username and roomId states
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");

  //track error state
  const [error,setError] = useState(null);

  //queue for incoming messages
  const [messageQueue, setMessageQueue] = useState([]);

  const [showChatwindow, setshowChatwindow] = useState(false);

  //once only when component mounts connect to socket
  //keep listening for server events
  useEffect(() => {
    
    
    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);

    socket.on("connect", () => {
      console.log(socket.id); 
    });

    socket.on("error", (message)=>{

      console.log(message.errorMsg)
      setError(message.errorMsg);
      console.log("some rrror cooured");

    })
  

    socket.on('receive-message', (message)=>{
    console.log(message);
    //populate message queue
    setMessageQueue(state => [...state, message])

    })

  }, []);


  const createRoom = async (evt) =>{

    evt.preventDefault();

    try {

      const response = await fetch(`${ENDPOINT}/getRoomId`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'socketId':socket.id}),
    });


      const data = await response.json();
      console.log(data);
      console.log("asddsa");
      console.log(`room id is - ${data.roomId}`);
      setRoomId(data.roomId);
      
      socket.emit('join-room',{
        username: userName,
        roomId: data.roomId,
      });
      

      console.log(data);
      
      setshowChatwindow(true);

    } catch (error) {
      console.log(error);
      
    }

    

  }

  const joinRoom = (evt) =>{

    evt.preventDefault();

    socket.emit('join-room',{
      username: userName,
      roomId: roomId,
    });
    
  
    setshowChatwindow(true);

  }

  const handleSubmit = (evt) => {

    console.log('sending message to server')
    socket.emit('send-message',
    { 
      id:socket.id,
      from:userName,
      text:name,
      roomId:roomId
    });

    evt.preventDefault();
  }


  const action = props.match.params.action;

  let displayForm;

  if(action === "join" && showChatwindow === false)
  {
     displayForm =   <form className="form" onSubmit={joinRoom}>
                                  <label>
                                    Username:
                                  </label>
                                    <input
                                      type="text"
                                      value={userName}
                                      onChange={e => setUserName(e.target.value)}
                                    />
                                 
                                  <label>
                                    Room code:
                                  </label>
                                    <input
                                      type="text"
                                      value={roomId}
                                      onChange={e => setRoomId(e.target.value)}
                                    />
                                  
                                  <button type="submit">Join Room</button>
                           </form>


  }
  
  else if(showChatwindow === false )
  {
     displayForm = 
                        <form className="form" onSubmit={createRoom}>
                          <label>
                            Username:
                          </label>
                            <input
                              type="text"
                              value={userName}
                              onChange={e => setUserName(e.target.value)}
                            />
                        
                          <button type="submit">Create Room</button>
                        </form>

  }
  else
  {
    displayForm = null;
  }



  return(

    


    <div>

      {error?<Redirect
            to={{
            pathname: "/",
          }}
        />:null}
    <Header roomId={roomId} />
    <div className="chatWindowContainer">

    
      { showChatwindow?
      
      <div className="messageBox">

          <div className="participantsList">
                <h3>Participants</h3>
          </div>

          <div className="messagesList">
              <div className="messageQueue">
                  {messageQueue.map((message)=>{
                      return(
                        <div className="message">
                            <span>{message.from}</span>
                            <p>
                            {message.text}
                            </p>
                        </div>
                      )
                  })} 
              </div>

              <div className="messageInput">
                <form className="messageForm" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder="Enter your message here"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  
                    <button type="submit">Send</button>
                </form>
              </div>
            </div>
          </div>
            
      :null
      }

      {displayForm}
  
    </div>
  </div>
  )




}