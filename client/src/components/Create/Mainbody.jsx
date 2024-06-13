import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Question } from '../../context/QuestionContext'

function Mainbody() {
  const [uploading, setUploading] = useState()
  const [ques, setQues] = useState()
  const [options1, setOptions1] = useState()
  const [options2, setOptions2] = useState()
  const [options3, setOptions3] = useState()
  const [options4, setOptions4] = useState()
  const {mainQuestion, setHeadingQuestion, setMainQuestion} = useContext(Question)
  
  function handleInputQuestion(e){
    e.preventDefault()
    setQues(e.target.value)
    setHeadingQuestion(e.target.value)
    console.log(ques)
  }

  function handleOption1(e){
    e.preventDefault()
    setOptions1(e.target.value)
  }
  function handleOption2(e){
    e.preventDefault()
    setOptions2(e.target.value)
    
  }
  function handleOption3(e){
    e.preventDefault()
    setOptions3(e.target.value)
    
  }
  function handleOption4(e){
    e.preventDefault()
    setOptions4(e.target.value)
    
  }

  async function handleUploadQuestion(){
    setMainQuestion((prev)=>({  
      ...prev , question : ques, answerList : [
        {name:'options1',body: options1, isCorrect:false},{name:'options2',body:options2,isCorrect:false},
        {name:'options3',body:options3,isCorrect:false},{name:'options4',body:options4,isCorrect:false}
      ]
    }))

    // const res = await uploadapi(question)
  }

  useEffect(()=>{
    console.log('main question : ', mainQuestion)
  }, [mainQuestion])

  return (
    <div className="mainbody">
      <div className="main-bodyinput">
        <input onChange={(e)=>handleInputQuestion(e)}
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
            <div onClick={handleUploadQuestion} >save question</div>
          </p>
        </div>
      </div>
      <div className="answer">
        <div className="answer-1">
          <input onChange={(e)=>handleOption1(e)} className="answer-input-1" type="text" placeholder='Add Answer 1'/>
          <input onChange={(e)=>handleOption2(e)} className="answer-input-3" type="text" placeholder='Add Answer 2 '/>
        </div>
        <div className="answer-2">
          <input onChange={(e)=>handleOption3(e)} className="answer-input-2" type="text" placeholder='Add Answer-3 (Optional)'/>
          <input onChange={(e)=>handleOption4(e)} className="answer-input-4" type="text" placeholder='Add Answer 4 (Optional)'/>
        </div>
      </div>
    </div>
  )
}

export default Mainbody
