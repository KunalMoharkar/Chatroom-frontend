import React, {useState,useEffect, useRef} from 'react';
import socketIOClient from "socket.io-client";
import {Redirect} from 'react-router-dom';
import './room.css';

import {Header}  from '../components/Header/Header'

import {CreateRoomForm, JoinRoomForm, MessageForm} from '../components/Forms/forms'
import {ParticipantsList} from '../components/ParticipantsList/ParticipantsList'

const ENDPOINT = "http://127.0.0.1:5000";

export const Room =(props)=>{


  //state variable for socket
  const [socket,setSocket] = useState({});
  const [messageText, setMesssageText] = useState("");
  //username and roomId states
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  //track error state
  const [error,setError] = useState(null);
  //participants
  const [participantsList, setParticipantsList] = useState([]);
  //queue for incoming messages
  const [messageQueue, setMessageQueue] = useState([]);
  const [showChatwindow, setshowChatwindow] = useState(false);
  //once only when component mounts connect to socket

  const bottomRef = useRef(null);
  //const bottomRef = React.createRef();
  const scrollToBottom = () => {

    if(bottomRef.current !== null)
    {

   bottomRef.current.scrollIntoView({
  behavior: "smooth",
  });

}
};

useEffect(() => {
  scrollToBottom();
  //console.log(messageQueue.current);
  //console.log(bottomRef.current);
}, [messageQueue]);

 
  //keep listening for server events
  useEffect(() => {
    
    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);

    socket.on("connect", () => {
      console.log(socket.id); 
    });

    //handle errors
    socket.on("error", (message)=>{

      console.log(message.errorMsg)
      setError(message.errorMsg);
      console.log("some rrror cooured");

    })

    //listen for updates on participants
    socket.on("participants", (message)=>{

      console.log(message.participantsList);
      setParticipantsList(message.participantsList);

    });
  
    //keep receiving messages
    socket.on('receive-message', (message)=>{
    console.log(message);
    //populate message queue
    setMessageQueue(state => [...state, message])

    })

    //on componenet unmount disconnect socket
    return function cleanup(){
      socket.disconnect();
    }

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
      text:messageText,
      roomId:roomId
    });

    evt.preventDefault();
  }




  const action = props.match.params.action;
  let displayForm;

  const inputUserName =  <input
                            type="text"
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                          />

  const inputRoomCode = <input 
                          type="text"
                          value={roomId}
                          onChange={e => setRoomId(e.target.value)}
                        />

  const inputMessage =  <input
                          type="text"
                          placeholder="Enter your message here"
                          value={messageText}
                          onChange={e => setMesssageText(e.target.value)}
                        />

  if(action === "join" && showChatwindow === false)
  {
     displayForm =  <JoinRoomForm
                     submitHandler = {joinRoom}
                     userNameLabel = "Username :"
                     inputUserName = {inputUserName}   
                     roomCodeLabel = "Room Code :" 
                     inputRoomCode = {inputRoomCode} 
                   />
    
  }
  else if(showChatwindow === false )
  {   
     displayForm =  <CreateRoomForm
                      submitHandler = {createRoom}
                      userNameLabel = "Username :"
                      inputUserName = {inputUserName}     
                    />
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

          <ParticipantsList 
            participantsList = {participantsList}
          />

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

                <div ref={bottomRef} className="list-bottom">
                </div>  
            </div>


              <div className="messageInput">
                <MessageForm
                   submitHandler = {handleSubmit}
                   inputMessage = {inputMessage} 
                />
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