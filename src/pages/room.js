import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import { Redirect } from "react-router-dom";
import short from "short-uuid"
import "./room.css";
import { Header } from "../components/Header/Header";
import {CreateRoomForm, JoinRoomForm, MessageForm} from "../components/Forms/forms";
import { ParticipantsList } from "../components/ParticipantsList/ParticipantsList";
const ENDPOINT = "https://kdm1700-chat-room.herokuapp.com";

export const Room = (props) => {
  //state variable for socket
  const [socket, setSocket] = useState({});
  const [messageText, setMesssageText] = useState("");
  //username and roomId states
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  //track error state
  const [error, setError] = useState(null);
  //participants
  const [participantsList, setParticipantsList] = useState([]);
  //queue for incoming messages
  const [messageQueue, setMessageQueue] = useState([]);
  const [showChatwindow, setshowChatwindow] = useState(false);
  const [showParticipants, setshowParticipants] = useState("hide");
  

  const bottomRef = useRef(null);
  const scrollToBottom = () => {
    if (bottomRef.current !== null) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  //if messageQueue did update then scroll to bottom of chat window
  useEffect(() => {
    scrollToBottom();
  }, [messageQueue]);

  //once only when component mounts connect to socket
  //keep listening for server events
  useEffect(() => {

    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);

    socket.on("connect", () => {
      console.log(socket.id);
    });

    //handle errors
    socket.on("error", (message) => {
      console.log(message.errorMsg);
      setError(message.errorMsg);
    });

    //listen for updates on participants
    socket.on("participants", (message) => {
      console.log(message.participantsList);
      setParticipantsList(message.participantsList);
    });

    //keep receiving messages
    socket.on("receive-message", (message) => {
      console.log(message);
      //populate message queue
      setMessageQueue((state) => [...state, message]);
    });

    //on componenet unmount disconnect socket
    return function cleanup() {
      socket.disconnect();
    };
  }, []);

  const createRoom = async (evt) => {
    evt.preventDefault();
    try {
      const response = await fetch(`${ENDPOINT}/getRoomId`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ socketId: socket.id }),
      });

      const data = await response.json();
      console.log(data);
      console.log(`room id is - ${data.roomId}`);
      setRoomId(data.roomId);

      socket.emit("join-room", {
        username: userName,
        roomId: data.roomId,
      });

      console.log(data);
      setshowChatwindow(true);
    } catch (error) {
      console.log(error);
    }
  };

  const joinRoom = (evt) => {
    evt.preventDefault();

    socket.emit("join-room", {
      username: userName,
      roomId: roomId,
    });

    setshowChatwindow(true);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    console.log("sending message to server");
    socket.emit("send-message", {
      id: socket.id,
      from: userName,
      text: messageText,
      roomId: roomId,
    });

    setMesssageText("");
    
  };

  const openParticipantWindow = () =>{

    if(showParticipants === "hide")
    {
      setshowParticipants("show");
    }
    else
    {
      setshowParticipants("hide");
    }


  }

  const action = props.match.params.action;
  let displayForm;

  const inputUserName = (
    <input
      type="text"
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
    />
  );

  const inputRoomCode = (
    <input
      type="text"
      value={roomId}
      onChange={(e) => setRoomId(e.target.value)}
    />
  );

  const inputMessage = (
    <input
      type="text"
      placeholder="Enter your message here"
      value={messageText}
      onChange={(e) => setMesssageText(e.target.value)}
    />
  );

  if (action === "join" && showChatwindow === false) {
    displayForm = (
      <JoinRoomForm
        submitHandler={joinRoom}
        userNameLabel="Username :"
        inputUserName={inputUserName}
        roomCodeLabel="Room Code :"
        inputRoomCode={inputRoomCode}
      />
    );
  } else if (showChatwindow === false) {
    displayForm = (
      <CreateRoomForm
        submitHandler={createRoom}
        userNameLabel="Username :"
        inputUserName={inputUserName}
      />
    );
  } else {
    displayForm = null;
  }

  return (
    <div className="container">
      {error ? (
        <Redirect
          to={{
            pathname: "/",
            state: {message:error}
          }}
        />
      ) : null}

      {showChatwindow?
      <Header roomId={roomId} clickHandler={openParticipantWindow} />
      :null    
        }
      <div className="chatWindowContainer">
        {showChatwindow ? (
          <div className="messageBox">
            <ParticipantsList participantsList={participantsList} 
            currentState={showParticipants} 
            exitHandler={openParticipantWindow}/>

            <div className="messagesList">
              <div className="messageQueue">
                {messageQueue.map((message) => {
                  return (
                    <div key={short.generate()} className="message">
                      <span>{message.from}</span>
                      <p>{message.text}</p>
                    </div>
                  );
                })}

                <div ref={bottomRef} className="list-bottom"></div>
              </div>

              <div className="messageInput">
                <MessageForm
                  submitHandler={handleSubmit}
                  inputMessage={inputMessage}
                />
              </div>
            </div>
          </div>
        ) : null}
        {displayForm}
      </div>
    </div>
  );
};
