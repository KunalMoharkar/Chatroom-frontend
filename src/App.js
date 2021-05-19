import React from "react";
import {Card} from "./components/card/card";
import './App.css';
import {Link} from 'react-router-dom';

export const App = (props)=> {

  let alert = null;

  if(props.location.state !== undefined)
  {
    alert = <div className="alert alert-danger">
              <p>{props.location.state.message}</p>
            </div>
  }

  return (
    <div className="container">
       {alert}
    <div className="AppContainer">
      <Link to={'/Room/join'}>
      <Card heading="Join Room" text="Enter the room code and you are all set"/>
      </Link>
      <Link to={'/Room/create'}>
      <Card heading="Create Room" text="Create your own room and invite others"/>
      </Link>
    </div>
    </div>
  );
}

export default App;
