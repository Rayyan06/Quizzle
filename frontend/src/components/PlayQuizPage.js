import React, { useState, useEffect } from "react";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { Grid, Typography, TextField, Button, ButtonBase, Card, CardActionArea, CardContent, CircularProgress, Box } from "@material-ui/core";
import { CheckIcon, Close } from '@material-ui/icons';
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
const my_theme = createMuiTheme({
    palette: {
        primary: {
            main: "#b0bec5",
            light: "#e2f1f8",
            dark: "#808395",
            contrastText: "#000000"
            
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
        padding: theme.spacing(20),
        height: "100vh",
        width: "100vw",
        background: my_theme.palette.primary.light

    },
    main: {
        padding: theme.spacing(2),
        alignItems: 'center',
        align: 'center',
        justify: 'center',
        background: my_theme.palette.primary.light
    },
    answerCard: {
        background: my_theme.palette.secondary.main,
    },
    spinner: {
        color: my_theme.palette.secondary.dark
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
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState([]);
    const [timeLimit, setTimeLimit] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimeLeft, setIsTimeLeft] = useState(true);
    const [answered, setAnswered] = useState(false);



    const getQuestionDetails = () => {
        const request = async() => {
            const response = await fetch('/api/get-question' + '?id=' + questionId)
            const json = await response.json()
            return json
        }
        request().then((data)=>{
            setQuestionText(data.text)
            setAnswers(data.answers)
            setTimeLimit(data.time_limit)
            setTimeLeft(data.time_limit)
        })
    }
    

    


    useEffect(()=>{

        getQuestionDetails();

    }, []);

    useEffect(()=>{
        getQuestionDetails();
    }, [questionId])


    useEffect(()=>{
        let timer = timeLeft > 0 && setInterval(() => {
            setTimeLeft(timeLeft => timeLeft - 1)
        } , 1000)

        if (!timeLeft) { props.handleSubmit(false) } 

        return ()=>{
            clearInterval(timer)
        };
    }, [timeLeft])

    const handleAnswerButtonClicked = (answer) => {
        if (answer.is_correct) {
            props.handleSubmit(true)
        } else {
            props.handleSubmit(false)
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
    let progressAmount = (timeLeft/timeLimit) * 100;

    const renderQuestionPage=()=>(
        <div>
            <ThemeProvider theme={my_theme}>
                <Grid item xs={12}>
                    <CircularProgressWithLabel className='spinner' value={progressAmount} time_left={timeLeft} size={80} thickness={5}/>
                    <Typography component="h2" variant="h2">#{props.questionNum} : {questionText}</Typography>
                </Grid>
                <Grid item xs={12}>
                    {answers ? renderAnswers() : <Typography component="h2" variant="h2">LOADING...</Typography>}
                </Grid>
            </ThemeProvider>
        </div>
    )
    const renderAnsweredPage = (isCorrect) => (
        isCorrect ? <CheckIcon /> : <Close />
    )


    return (<div>{answered ? renderAnsweredPage(true) : renderQuestionPage}</div>);

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
    
    const handleSubmit=(isCorrect)=>{
        setAnswered(true);

        if (isCorrect) {
            // Show success
            
            console.log("WIN WIN")     
        } else {
            // Show failure
            console.log("LOSE LOSER")
        }
        setCurrQuestionNum(currQuestionNum=>currQuestionNum+1);
        setCurrQuestionID(questionsList[currQuestionNum])
        console.log(currQuestionID)
    }

    //console.log(currQuestionID)

    const renderQuestion =()=>(<Question questionId={currQuestionID} handleSubmit={handleSubmit} questionNum={currQuestionNum}/>);
 
 

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