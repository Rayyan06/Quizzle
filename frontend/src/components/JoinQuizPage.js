import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Grid, Button, Typography, TextField } from "@material-ui/core";


import Cookies from 'js-cookie';
const csrftoken = Cookies.get('csrftoken');


const JoinQuizPage = (props) => {
  const [quizCode, setQuizCode] = useState("");
  const [error, setError] = useState("");

  const handleTextFieldChange = e => {
      setQuizCode(e.target.value);
  }
  const quizButtonPressed = () => {
      const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrftoken
            },
          body: JSON.stringify({
              code: quizCode
          })
      };
      fetch('/api/join-quiz', requestOptions)
      .then((response) => {
          if (response.ok) {
              props.history.push(`/play/${quizCode}`);
          } else {
              setError("Quiz not found")
          }        
      })
      .catch((error) => console.log(error));
  }

  return (
      <div className='center'>
        <Grid container spacing={1}> 
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Join Quiz!
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <TextField 
                error={error}
                label="Code"
                placeholder="Enter a Quiz Code"
                value={quizCode}
                helperText={error}
                variant='outlined'
                onChange={handleTextFieldChange}
                />

            </Grid>
            <Grid item xs={12} align="center">
                <Button variant='contained' color="primary" onClick={ quizButtonPressed }>Enter Quiz</Button>

            </Grid>
            <Grid item xs={12} align="center">
                <Button variant='contained' color="secondary" to="/" component={Link}>Back</Button>

            </Grid>
        </Grid>
      </div>
  );
}



export default JoinQuizPage;