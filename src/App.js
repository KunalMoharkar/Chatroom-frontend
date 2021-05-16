import React from "react";
import {Card} from "./components/card/card";
import './App.css';
import {Link} from 'react-router-dom';

export const App = ()=> {


  return (
    <div className="AppContainer">
      <Link to={'/Room/join'}>
      <Card heading="Join Room" text="adssdasdasd"/>
      </Link>
      <Link to={'/Room/create'}>
      <Card heading="Join Room" text="adssdasdasd"/>
      </Link>
    </div>
  );
}

export default App;
