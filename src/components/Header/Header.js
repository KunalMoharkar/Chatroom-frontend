import React from 'react';
import './Header.css';


export const Header = (props) =>{

    return(

        <div className="header">
            {props.roomId?
            <h3>Room code : {props.roomId}</h3>
            :null
            }
            {/*
            
            <button onClick={props.clickHandler}>open</button>
            */}
        </div>

    )


}
 

