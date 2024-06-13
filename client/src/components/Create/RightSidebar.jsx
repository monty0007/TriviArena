import React, { useContext, useState , useEffect} from 'react'
import { Question } from '../../context/QuestionContext'

function RightSidebar() {
  const {mainQuestion, setMainQuestion} = useContext(Question)
  const [quesType, setQuesType] = useState()
  const [pType, setPType] = useState()
  const [aType, setAType] = useState()
  const [text, setText] = useState({})

  function handleType(e){
   
  }

  async function handleUploadQuestion(){
    setMainQuestion((prev)=>({  
      ...prev , 
    }))

    // const res = await uploadapi(question)
  }

  useEffect(()=>{
    console.log('main question : ', mainQuestion)
  }, [mainQuestion])

  return (
    <div className="rightSidebar">
      <div className="imagee">
        <img src="questionType.svg" alt="" />
        <h5>Question type</h5>
      </div>
      <select name="" id="">
        <option name='qType' value={text.qType} onChange={handleType} >Quiz</option>
      </select>
      <div className="imagee">
        <img src="timer.svg" alt="" />
        <h5>Time limit</h5>
      </div>
      <select name="" id="">
        <option value="">5 Seconds</option>
        <option value="">10 Seconds</option>
        <option value="">20 Seconds</option>
        <option value="">30 Seconds</option>
        <option value="">1 Minute</option>
        <option value="">5 Minute</option>
        <option value="">10 Minute</option>
        <option value="">30 Minute</option>
      </select>
      <div className="imagee">
        <img src="gamePoints.svg" alt="" />
        <h5>Points</h5>
      </div>
      <select name="" id="">
        <option value="">Standard</option>
        <option value="">Double Points</option>
      </select>
      <div className="imagee">
        <img src="answerOptions.svg" alt="" />
        <h5>Answer options</h5>
      </div>
      <select name="" id="">
        <option value="">Single Select</option>
        <option value="">Multi-Select</option>
      </select>
    </div>
  )
}

export default RightSidebar
