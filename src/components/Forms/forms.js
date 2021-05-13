import React from 'react'
import './forms.css'

export const CreateRoomForm = (props) =>{


    return(
        
    <form className="form" onSubmit={props.submitHandler}>
        <label>
        {props.userNameLabel}
        </label>
        {props.inputUserName}
        <button type="submit">Create Room</button>
    </form>

    )

}

export const JoinRoomForm = (props) =>{

    return(
        
        <form className="form" onSubmit={props.submitHandler}>
            <label>
            {props.userNameLabel}
            </label>
            {props.inputUserName}

            <label>
            {props.roomCodeLabel}
            </label>
            {props.inputRoomCode}   

            <button type="submit">Join Room</button>
        </form>
    
        )


}