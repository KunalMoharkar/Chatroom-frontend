import React from "react";
import './card.css';


export const Card = (props) =>{



return(


    <div className="Card">
        <h2>{props.heading}</h2>
        <p>{props.text}</p>
    </div>

)





}