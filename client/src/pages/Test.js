import React, { Component } from "react";
import FinalCard from "../components/FinalCard";
import API from "../utils/API";
import { Col, Row, Container } from "../components/Grid";
import QuestionCard from "../components/QuestionCard";
import { MyContext } from "../MyContext";
import { FormBtn } from "../components/Form";
import Score from "../components/Score";
import {Animated} from "react-animated-css";
import Nav from "../components/Nav";
import { ShuffleSound, FailSound, BellSound, DoneSound } from "../components/Sounds";
import Footer from "../components/Footer";
import { Redirect } from 'react-router';


class Test extends Component {
  constructor(props) {
    super(props);

  this.userAnswer = React.createRef();

  this.state = {
    allQuestions: [],
    question: "",
    answer: "",
    correct: 0,
    wrong: 0,
    notDone: true,
    rightScreen: true,
    correctSound: false
  };
}

componentDidMount() {
  API.getUser(this.context.currentId).then(res => this.setState({ allQuestions : res.data.questions }))
  .then(()=>console.log(this.state.allQuestions))
}

shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
     return a
    }

    checkAnswer = (userAnswer, correctAnswer, id) => {
      let where;
      let whereWrong;
       if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
         console.log("Correct!")
         for (var i = 0; i < this.state.allQuestions.length; i++) {
           if (id === this.state.allQuestions[i]._id) {
             where = i;
           }
         }
         var tempState = this.state;
         tempState.allQuestions[where].active = false;
         if (this.state.correct + 1 === this.state.allQuestions.length) {
    
         this.setState({ allQuestions : tempState.allQuestions, correct : this.state.correct + 1, notDone:false, correctSound: true });
         }
         else {
          this.setState({ allQuestions : tempState.allQuestions, correct : this.state.correct + 1, correctSound: true });
         }
       }
       else {
         console.log("Wrong");
         ;
         for (var j = 0; j < this.state.allQuestions.length; j++) {
          if (id === this.state.allQuestions[j]._id) {
            whereWrong = j;
          }
        }
        
        var temp2State = this.state;
         temp2State.allQuestions[whereWrong].correct = true;
         console.log(this.state.allQuestions[whereWrong].question);
         this.setState({ allQuestions: temp2State.allQuestions, wrong: this.state.wrong + 1, rightScreen: false, correctSound: false })
         console.log(this.state);
       }
    }

    wrongAnswer = (question, answer, id) => {
      console.log(question, answer, id);
      let whereWrong;
      for (var k = 0; k < this.state.allQuestions.length; k++) {
        if (id === this.state.allQuestions[k]._id) {
          whereWrong = k;
        }
      }
      var temp3State = this.state;
       temp3State.allQuestions[whereWrong].correct = false;
       console.log(this.state.allQuestions[whereWrong].question);
       this.setState({ allQuestions: temp3State.allQuestions, rightScreen: true})
       console.log(this.state);
    
    }

    restartGame = () => {
      API.getUser(this.context.currentId)
      .then(res => this.setState({ allQuestions : res.data.questions, question:"", answer:"", correct:0, wrong:0, notDone:true, rightScreen:true, correctSound: false }))
    }

render() {
    return (
      <Container fluid>

       <Nav/>
       <MyContext.Consumer>
       {({ auth }) => (
         auth ? (
     
         <div>
          {this.state.notDone ? (
            <Row>
              <Col size="md-12">
                <Score 
                correct={this.state.correct}
                wrong={this.state.wrong}
                restartGame = {this.restartGame}
                />

              {this.state.rightScreen ? (    

                <div className="quesWrap">
                  {this.shuffle(this.state.allQuestions).filter(i=>i.active !== false).slice(0, 1).map(i=> (
                  <div className="questionCard" key={i._id+"div"}>
                  {this.state.correctSound ? <BellSound /> : <ShuffleSound />}
                  <Animated animationIn="bounceInRight" animationOut="wobble" isVisible={true}>
                    <QuestionCard 
                    key={i._id+"questionCard"}
                    question={i.question}
                    >
                    </QuestionCard>
                      <input className="answerInput" key={i._id+"Input"} placeholder="Answer" ref={this.userAnswer} />
                    <FormBtn
                      key={i._id+"Button"}
                      onClick={()=>this.checkAnswer(this.userAnswer.current.value, i.answer, i._id)}
                      >Submit <i class="fas fa-check-circle"></i>
                    </FormBtn>
                  </Animated>
                  </div>
                ))}
                </div>

                ) : (

                  <div className="quesWrap">
                  {this.state.allQuestions.filter(i=>i.correct !== false).map(i=> (
                  <div className="questionCard" key={i._id+"div"}>
                  <FailSound />
                  <Animated animationIn="wobble" animationOut="wobble" isVisible={false}>
                    <QuestionCard 
                    key={i._id+"questionCard"}
                    question={"The correct answer was, " + '"' +i.answer + '"'}
                    >
                    </QuestionCard>
                  </Animated>
                  <FormBtn
                      key={i._id+"Button"}
                      onClick={()=>this.wrongAnswer(i.question, i.answer, i._id)}
                      >Got It!
                    </FormBtn>
                  </div>
                ))}
                </div>)}


              </Col>
              <Footer></Footer>
            </Row>  /////////////////////////////////////////////GAME SUMMARY RENDER/////////////////////////////////////////////
          ) : (  
            <Row>
            <Col size="md-12">
              <Score 
              correct={this.state.correct}
              wrong={this.state.wrong}
              restartGame = {this.restartGame}
              />
              <Animated animationIn="zoomInUp" animationOut="zoomInUp" isVisible={false} > 
                <div style={{margin:"75px"}}>
                  <FinalCard
                  key={"resultCard"}
                  correct={this.state.correct}
                  wrong={this.state.wrong}
                  >
                  </FinalCard>
                </div>
                </Animated> 
                <DoneSound />
            </Col>
          </Row>
          

          
          )} </div> ) : (<Redirect to="/"/>))}

        </MyContext.Consumer>
      </Container>
    );
  }
}
Test.contextType = MyContext;
export default Test;