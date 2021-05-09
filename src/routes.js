import React from "react";
import {HashRouter, Route} from "react-router-dom";
import {App} from "./App";
import {Room} from "./pages/room";


export const Routes=()=>{

    return(

        <HashRouter>
            <Route exact path={"/"} component={App}/>
            <Route exact path={"/Room/:action"} component={Room}/>
        </HashRouter>
    )

}