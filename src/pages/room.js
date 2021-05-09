import React, {useState,useEffect} from 'react';
import socketIOClient from "socket.io-client";
import './room.css';
const ENDPOINT = "http://127.0.0.1:5000";



export const Room =(props)=>{


  //state variable for socket
  const [socket,setSocket] = useState({});
  const [name, setName] = useState("");

  //username and roomId states
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");

  //queue for incoming messages
  const [messageQueue, setMessageQueue] = useState([]);

  const [showChatwindow, setshowChatwindow] = useState(false);

  //once only when component mounts connect to socket
  //keep listening for server events
  useEffect(() => {
    
    //console.log(props.match.params.action);

    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);

    socket.on("connect", () => {
      console.log(socket.id); 
    });
  

    socket.on('receive-message', (message)=>{
      
    console.log(message);

    //populate message queue
    setMessageQueue(state => [...state, message])

    })

  }, []);


  const createRoom = async (evt) =>{

    try {

      const response = await fetch(`${ENDPOINT}/getRoomId`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'socketId':socket.id}),
    });


      const data = await response.json();

      console.log(data);
      setRoomId(data.roomId);

      socket.emit('join-room',{
        username: userName,
        roomId: roomId,
      });

      setshowChatwindow(true);

    } catch (error) {
      console.log(error);
    }

    evt.preventDefault();

  }

  const joinRoom = (evt) =>{

    socket.emit('join-room',{
      username: userName,
      roomId: roomId,
    });

    setshowChatwindow(true);

    evt.preventDefault();

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
     displayForm =   <form onSubmit={joinRoom}>
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


  }
  
  else if(showChatwindow === false )
  {
     displayForm = 
                        <form onSubmit={createRoom}>
                          <label>
                            Username:
                            <input
                              type="text"
                              value={userName}
                              onChange={e => setUserName(e.target.value)}
                            />
                          </label>
                          
                          <input type="submit" value="Create Room" />
                        </form>

  }
  else
  {
    displayForm = null;
  }



  return(

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

              <div>
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
              </div>
            </div>
          </div>
            
      :null
      }

      {displayForm}
  

    </div>

  )




}