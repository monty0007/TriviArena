import React, { useContext, useEffect, useState } from "react";
import { Question } from "../../context/QuestionContext";

function Mainbody() {
  const [uploading, setUploading] = useState(false);
  const [correctOption, setCorrectOption] = useState("");
  console.log(correctOption);
  const {
    mainQuestion,
    setHeadingQuestion,
    setMainQuestion,
    displayQuestion,
    setDisplayQuestion,
    quiz,
    setQuiz,
  } = useContext(Question);

  // Update correctOption when displayQuestion changes
  useEffect(() => {
    if (displayQuestion) {
      const correctAnswer = displayQuestion.answerList.find(
        (option) => option.isCorrect
      );
      console.log(correctAnswer);
      if (correctAnswer) {
        setCorrectOption(correctAnswer.name);
      } else {
        setCorrectOption("");
      }
    }
  }, [displayQuestion]);

  const handleInputQuestion = (e) => {
    const newQuestion = e.target.value;
    setDisplayQuestion((prev) => ({
      ...prev,
      question: newQuestion,
    }));
    setHeadingQuestion(newQuestion);
    updateMainQuestion({ question: newQuestion });
  };

  const handleOptions = (e) => {
    const { name, value } = e.target;
    setDisplayQuestion((prev) => ({
      ...prev,
      answerList: prev.answerList.map((option) => ({
        ...option,
        body: option.name === name ? value : option.body,
      })),
    }));
    updateMainQuestion({
      answerList: displayQuestion.answerList.map((option) => ({
        ...option,
        body: option.name === name ? value : option.body,
      })),
    });
  };

  const handleRadio = (e) => {
    const { name } = e.target;
    setCorrectOption(name);
    setDisplayQuestion((prev) => ({
      ...prev,
      answerList: prev.answerList.map((option) => ({
        ...option,
        isCorrect: option.name === name,
      })),
    }));
    updateMainQuestion({
      answerList: displayQuestion.answerList.map((option) => ({
        ...option,
        isCorrect: option.name === name,
      })),
    });
  };

  const updateMainQuestion = (updatedFields) => {
    setMainQuestion((prevQuestions) =>
      prevQuestions.map((question) =>
        question.questionIndex === displayQuestion.questionIndex
          ? { ...question, ...updatedFields }
          : question
      )
    );
  };

  return (
    <div className="mainbody">
      <div className="main-bodyinput">
        <input
          onChange={handleInputQuestion}
          value={displayQuestion?.question || ""}
          className="mainbody-input"
          type="text"
          placeholder="Start typing your question"
        />
        <div className="image quiz-img ">
          <img className="xrc" src="loading-xrc.png" alt="" />
          <p></p>
        </div>
      </div>
      <div className="answer">
        <div className="answer-1">
          <div className="ans-top">
            <input
              onChange={handleOptions}
              name="option1"
              value={
                displayQuestion?.answerList.find(
                  (option) => option.name === "option1"
                )?.body || ""
              }
              className="answer-input-1"
              type="text"
              placeholder="Add Answer 1"
              size={20}
            />
            <input
              type="radio"
              name="option1"
              id="option1"
              checked={correctOption === "option1"}
              onChange={handleRadio}
              className="custom-radio"
            />
            <label htmlFor="option1"></label>
          </div>
          <div className="ans-top">
            <input
              onChange={handleOptions}
              name="option2"
              value={
                displayQuestion?.answerList.find(
                  (option) => option.name === "option2"
                )?.body || ""
              }
              className="answer-input-3"
              type="text"
              placeholder="Add Answer 2"
            />
            <input
              type="radio"
              name="option2"
              id="option2"
              checked={correctOption === "option2"}
              onChange={handleRadio}
              className="custom-radio"
            />
            <label htmlFor="option2"></label>
          </div>
        </div>
        <div className="answer-2">
          <div className="ans-top">
            <input
              onChange={handleOptions}
              name="option3"
              value={
                displayQuestion?.answerList.find(
                  (option) => option.name === "option3"
                )?.body || ""
              }
              className="answer-input-2"
              type="text"
              placeholder="Add Answer 3"
            />
            <input
              type="radio"
              name="option3"
              id="option3"
              checked={correctOption === "option3"}
              onChange={handleRadio}
              className="custom-radio"
            />
            <label htmlFor="option3"></label>
          </div>
          <div className="ans-top">
            <input
              onChange={handleOptions}
              name="option4"
              value={
                displayQuestion?.answerList.find(
                  (option) => option.name === "option4"
                )?.body || ""
              }
              className="answer-input-4"
              type="text"
              placeholder="Add Answer 4"
            />
            <input
              type="radio"
              name="option4"
              id="option4"
              checked={correctOption === "option4"}
              onChange={handleRadio}
              className="custom-radio"
            />
            <label htmlFor="option4"></label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mainbody;
