import React from 'react'
import short from "short-uuid"
import './ParticipantsList.css'

export const ParticipantsList = (props) =>{

    return(

    <div className= {`participantsList ${props.currentState}`}>   
          <button onClick={props.exitHandler}>&#10006;</button>
          {props.participantsList.map((participant)=>{
            return(
            <div key={short.generate}>
              <p>{participant.userName}</p>
            </div>
            )
          })
        }
       
    </div>
    )


}

