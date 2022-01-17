import { useState } from "react";
import QuestionCard from "./components/QuestionCard"
import { fetchQuizQuestions, Difficulty, QuestionState } from "./API";
import { GlobalStyle, Wrapper } from "./App.styles";

const TOTAL_QUESTIONS = 10

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0)
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)

  console.log(questions)

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS,Difficulty.EASY)

    setQuestions(newQuestions)
    setScore(0);
    setNumber(0);
    setUserAnswers([])
    setLoading(false)
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
      if(!gameOver) {
        const answer = e.currentTarget.value
        const correctAnswer = questions[number].correct_answer
        const correct = correctAnswer === answer;
        if(correct){
          setScore(score => score + 1)
        }
        const answerObj = {
          question: questions[number].question,
          answer,
          correct,
          correctAnswer,
        }
        setUserAnswers(prev => [...prev, answerObj])
      }
  }

  const nextQuestion = () => {
    const nextQuestion = number +1

    if(TOTAL_QUESTIONS === nextQuestion){
      setGameOver(true)
    } else {
      setNumber(nextQuestion)
    }
  }


  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>React Quizz</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (<button className="start" onClick={startTrivia}>
          Start
        </button>) : null}
        {gameOver && <p className="score">Score: {score}</p>}
        {loading && <p>Loading questions...</p>}
        {!loading && !gameOver && <QuestionCard 
          questionNr={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        /> }
        {userAnswers.length === number + 1 && number + 1 !== TOTAL_QUESTIONS && 
        (<button 
          className="next" 
          onClick={nextQuestion}
        >
          Next Question
        </button>)}
      </Wrapper>
    </>
  );
}

export default App;
