import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import QuizCreatorPage from "./QuizCreatorPage";
import JoinQuizPage from "./JoinQuizPage";
import Quiz from "./PlayQuizPage";
import React from "react";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";


const HomePage = (props) => {


    const renderHomePage = (
        <div className='center'>
            <Grid container spacing={1}>
                <Grid item xs={12} align='center'>
                    <Typography variant="h3" compact="h3">Quizzle</Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/join" component={ Link }>
                            Join a Game
                        </Button>
                        <Button color="secondary" to="/create" component={ Link }>
                            Create A Game
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </div>
    )
    
    
    return (
        <Router>
            <Switch>
                <Route path='/play/:quizCode' component={Quiz} />
                <Route path='/create' component={QuizCreatorPage}/>
                <Route exact path='/' render={()=>(renderHomePage)} />
                <Route path='/join' component={JoinQuizPage}/>
            </Switch>
        </Router>
    );
}

export default HomePage;