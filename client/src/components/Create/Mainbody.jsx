import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Question } from '../../context/QuestionContext'

function Mainbody() {
  const [uploading, setUploading] = useState()
  const [ques, setQues] = useState()
  const [options, setOptions] = useState({
    option1 : '',
    option2 : '',
    option3 : '',
    option4 : '',
  })

  const {mainQuestion, setHeadingQuestion, setMainQuestion, setSaveQuestion, displayQuestion, setDisplayQuestion} = useContext(Question)
  
  function handleInputQuestion(e){
    e.preventDefault()
    setQues(e.target.value)
    setHeadingQuestion(e.target.value)
    setDisplayQuestion((prev)=>({
      ...prev,
      question : e.target.value  
    }))
  }

  function handleOptions(e){
    setOptions((prev)=>({
      ...prev, 
      [e.target.name] : e.target.value
    }))
    setDisplayQuestion((prev)=>({
      ...prev,
      options : {
        ...prev.options,
        [e.target.name] : e.target.value
      }
    }))
  }

  async function handleSaveQuestion(){
    const updatedQuestions = mainQuestion.map((question)=> question.id === displayQuestion.id ? displayQuestion: question )
    console.log('updated', updatedQuestions)
    // await hvjvjg(displayQuestion)
    setMainQuestion(updatedQuestions)
    console.log('main', mainQuestion)
  }


  return (
    <div className="mainbody">
      <div className="main-bodyinput">
        <input onChange={(e)=>handleInputQuestion(e)}
          value = {displayQuestion.question}
          className="mainbody-input"
          type="text"
          placeholder="Start typing your question"
        />
        <div className="image">
          Find and insert media
          <p>
            {' '}
            <input type="file" />
            {/* <Link>Upload file </Link> or drag to upload */}
            <button disabled={uploading}>{uploading ? "Uploading" : "Upload Image"}</button>
            <button onClick={handleSaveQuestion} >save question</button>
          </p>
        </div>
      </div>
      <div className="answer">
        <div className="answer-1">
          <input onChange={(e)=>handleOptions(e)} name='option1'  value={displayQuestion.options.option1} className="answer-input-1" type="text" placeholder={"Add Answer 1"}/>
          <input onChange={(e)=>handleOptions(e)} name='option2'  value={displayQuestion.options.option2} className="answer-input-3" type="text"   placeholder={"Add Answer 2"}/>
        </div>
        <div className="answer-2">
          <input onChange={(e)=>handleOptions(e)} name='option3' value={displayQuestion.options.option3} className="answer-input-2" type="text"  placeholder={"Add Answer 3"}/>
          <input onChange={(e)=>handleOptions(e)} name='option4' value={displayQuestion.options.option4} className="answer-input-4" type="text" placeholder={"Add Answer 4"}/>
        </div>
      </div>
    </div>
  )
}

export default Mainbody
