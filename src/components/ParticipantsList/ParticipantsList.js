import React from 'react'
import './ParticipantsList.css'

export const ParticipantsList = (props) =>{

    return(
    <div className="participantsList mobile-hide">
        <h3>Participants</h3>
        
          {props.participantsList.map((participant)=>{
            return(
            <div>
              <p>{participant.userName}</p>
            </div>
            )
          })
        }
       
    </div>
    )


}

