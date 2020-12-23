import React from "react";
import { render } from "react-dom";
import { Typography } from "@material-ui/core";
import HomePage from "./HomePage";

/*
import { Provider } from "react-redux";
import { store } from "redux";
*/

const App = (props) => {
    return (
        <HomePage />
    )
}

const appDiv = document.getElementById("app");
render(<App />, appDiv)