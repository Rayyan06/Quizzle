import React, { useState, useEffect } from "react";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { Grid, Typography, TextField, Button, ButtonBase, Card, CardActionArea, CardContent, CircularProgress, Box } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import PropTypes from 'prop-types'

/* 
I am thinking of making a Question Component to 
organize the code, but as long as the code in the Quiz component 
doesn't get too crazy, I will refrain from doing so. 

Well, turns out it did get crazy and I ended up 
doing it! lol :).
*/
const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#bf360c",
            light: "#f9683a",
            dark: "#870000",
            contrastText: "#ffffff"
            
        },
        secondary: {
            main: "#03a9f4",
            light: "#67daff",
            dark: "#007ac1",
            contrastText: "#000000"
        }
        
        
    }
})

const useStyles = makeStyles((theme)=>({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2),
        height: "100vh",
        width: "100vw",
        background: theme.palette.primary.main
    },
    main: {
        padding: theme.spacing(2),
        alignItems: 'center',
        align: 'center',
        justify: 'center',
        background: theme.palette.primary.light
    },
    answerCard: {
        background: theme.palette.secondary.main,
    }
}))



function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="button" component="h6" color="textSecondary">{`${Math.round(
          props.time_left,
        )}`}</Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};



const Question = (props) => {

    const questionId = props.questionId;
    const [question, setQuestion] = useState({});
    const [timeLimit, setTimeLimit] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimeLeft, setIsTimeLeft] = useState(true);

    const getQuestionDetails = () => {
        const request = async() => {
            const response = await fetch('/api/get-question' + '?id=' + questionId)
            const json = await response.json()
            return json
        }
        request().then((data)=>{
            setQuestion({'text': data.text, 'answers': data.answers})
            setTimeLimit(data.time_limit)
            setTimeLeft(data.time_limit)
            console.log(data.answers)
        })
    }
    

    // const answers = question['answers'].map((answer)=>
    //     <li key={answer.id}>
    //         {answer.text}
    //     </li>
    // );

    const answers = question['answers']

    // const startTimer = () => {
    //     setTimeLeft(20)
    //     console.log(timeLeft)
    //     const timer = setInterval(()=>{
    //         if (timeLeft>=0) {
    //             setTimeLeft(timeLeft => timeLeft - 1)

    //         } else {
    //             clearInterval(timer)
    //             alert("WHAT")
    //             props.handleSubmit(false);
            

    //         }
    //     }, 1000);
    //     return () => clearInterval(timer);
    // };
        const timer = setInterval(() => {
            setTimeLeft(timeLeft => timeLeft - 1)
            if (timeLeft < 0) {
                clearInterval(timer)
            } 
        } ,1000)
        


    useEffect(()=>{

        getQuestionDetails();
        timer;
    }, [])
    




    const handleAnswerButtonClicked = (answer) => {
        if (answer.is_correct==true) {
            props.handleSubmit(true);
        } else {
            props.handleSubmit(false);
        }
        
        
    }
    const classes = useStyles();
    
    const renderAnswers = () => {
        const answerList = answers.map((answer)=>
            <Grid align='center' item xs={12} sm={6}>
                    <Card 
                        key={answer.id} 
                        id={answer.id}
                        className={classes.answerCard}
                        >
                        <CardActionArea onClick={()=>handleAnswerButtonClicked(answer)}>
                            <CardContent> 
                                <Typography variant="body2" color="textSecondary" component="h4">{answer.text}</Typography>
                            </CardContent>

                        </CardActionArea>

                    </Card>
            </Grid>
        )

        return (
            <Grid container align='center' spacing={1}>
            

                {answerList}
                
            </Grid>
        ) 
    }

    //let seconds = Math.floor(timeLeft)
    //let progressAmount = Math.floor((timeLeft/timeLimit) * 100)

    //console.log(seconds);
    let progressAmount = (timeLeft/20) * 100;

    return (
        <div>
            <Grid item xs={12}>
                <CircularProgressWithLabel value={progressAmount} time_left={timeLeft} size={80} thickness={5}/>
                <Typography component="h2" variant="h2">{question.text}</Typography>
            </Grid>
            <Grid item xs={12}>
                {question['answers'] ? renderAnswers() : <Typography component="h2" variant="h2">LOADING...</Typography>}
            </Grid>
        </div>
    );
}


const Quiz = (props) => {
    /* Main Quiz Component */  

    const quizCode = props.match.params.quizCode;
    const [quizName, setQuizName] = useState("");
    const [isHost, setIsHost] = useState(false);
    const [questionsList, setQuestionsList] = useState([]) // This is a list (array) of the primary keys of the questions.
    const [currQuestionID, setCurrQuestionID] = useState(0);
    const [currQuestionNum, setCurrQuestionNum] = useState(0);
    const [jsonData, setJsonData] = useState({});

    const [score, setScore] = useState(0); // Player Score

    

    const renderStartQuizPage = () => {
        return (
            <Grid container spacing={1} />

        )
    };

    const renderQuizResultsPage=()=>{
        return (
            <Grid container spacing={1} />

        )
        
    };


    const getQuizDetails = () => {
        const request = async () => {
            const response = await fetch('/api/get-quiz' + '?code=' + quizCode);
            const json = await response.json()
            return json
        }
        /*
        fetch('/api/get-quiz' + '?code=' + quizCode)
        .then((response)=>response.json())
        .then((data)=>{
            setQuizName(data.name);
            //alert(data);
            setQuestionsList(data["questions"]); 
            setJsonData(data);
            setCurrQuestionID(data["questions"][0])
            //alert(questionsList)

        })
        .catch((error)=>{console.log(error)})
        */
        request().then((data)=>{
            setQuizName(data.name);
            setQuestionsList(data["questions"])
            setJsonData(data);
            setCurrQuestionID(data["questions"][0])
        }).catch((error)=>{console.log(error)})
    }

    
    useEffect(()=> {
        getQuizDetails();
    }, []);
    
    const handleSubmit=(correct)=>{
        setCurrQuestionNum(currQuestionNum+1);
        setCurrQuestionID(questionsList[currQuestionNum])
        if (correct) {
            console.log("correct")
        } else {
            console.log("WRONG")
        }
    }

    //console.log(currQuestionID)
    const renderQuestion = () => {
        return <Question questionId={currQuestionID} handleSubmit={handleSubmit}/>;
    }

    const classes = useStyles();

    return (
        <Grid container spacing={1} className={classes.root}>

            <Grid container spacing={1} className={classes.main}>

                {currQuestionID ? renderQuestion(): <Typography component="h2" variant="h2">Loading Question...</Typography>} 
            </Grid>

        </Grid>
    );
}


export default Quiz;