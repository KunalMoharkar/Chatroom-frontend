import React from 'react'
import short from "short-uuid"
import './ParticipantsList.css'

export const ParticipantsList = (props) =>{

    return(

    <div className= {`participantsList ${props.currentState}`}>
        <h3>Participants</h3>
        
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

