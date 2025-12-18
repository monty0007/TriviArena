import React, { useContext, useEffect, useState } from "react";
import { Question } from "../../context/QuestionContext";


function Mainbody() {
  const [correctOption, setCorrectOption] = useState("");
  const {
    mainQuestion,
    setHeadingQuestion,
    setMainQuestion,
    displayQuestion,
    setDisplayQuestion,
    quiz,
    validationError
  } = useContext(Question);

  console.log("Mainbody validationError:", validationError);

  // Update correctOption when displayQuestion changes
  useEffect(() => {
    if (displayQuestion) {
      const correctAnswer = displayQuestion.answerList.find(
        (option) => option.isCorrect
      );
      if (correctAnswer) {
        setCorrectOption(correctAnswer.name);
      } else {
        setCorrectOption("");
      }
    }
  }, [displayQuestion]);

  const updateMainQuestion = (updatedFields) => {
    setMainQuestion((prevQuestions) =>
      prevQuestions.map((question) =>
        question.questionIndex === displayQuestion.questionIndex
          ? { ...question, ...updatedFields }
          : question
      )
    );
  };

  const handleInputQuestion = (e) => {
    const newQuestion = e.target.value;
    setDisplayQuestion((prev) => ({
      ...prev,
      question: newQuestion,
    }));
    setHeadingQuestion(newQuestion);
    updateMainQuestion({ question: newQuestion });
  };

  const handleImage = (base64) => {
    setDisplayQuestion((prev) => ({
      ...prev,
      backgroundImage: base64,
    }));
    updateMainQuestion({ backgroundImage: base64 });
  }

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

  const handleRadio = (name) => {
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

  const renderOptionInput = (optionName, placeholder, colorClass, label) => {
    const option = displayQuestion?.answerList.find((o) => o.name === optionName);
    const isCorrect = correctOption === optionName;
    const hasError = validationError && validationError[optionName];
    const missingCorrect = validationError && validationError.correctOption;

    // For True/False, only show first 2 options and potentially lock content
    if (quiz?.questionType === 'TrueFalse' && (optionName === 'option3' || optionName === 'option4')) {
      return null;
    }

    // Pre-fill True/False text if empty
    // (This logic could be improved to force "True"/"False" text)

    return (
      <div className={`relative group w-full h-full flex items-center rounded-xl p-4 transition-all duration-200 ${colorClass} shadow-lg hover:shadow-xl hover:scale-[1.01] ${hasError ? 'ring-4 ring-red-500 border-red-600' : ''}`}>
        {/* Checkbox/Radio circle */}
        <div
          onClick={() => handleRadio(optionName)}
          className={`w-10 h-10 rounded-full border-4 flex items-center justify-center cursor-pointer flex-shrink-0 mr-4 transition-all 
            ${isCorrect ? 'border-white bg-green-500' : 'border-white/50 bg-transparent hover:bg-white/10'}
            ${!isCorrect && missingCorrect ? 'border-red-500 bg-red-500/20 animate-pulse' : ''}
          `}
        >
          {isCorrect && <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>

        <input
          onChange={handleOptions}
          name={optionName}
          value={option?.body || ""}
          className={`w-full bg-transparent border-none text-white text-xl font-bold placeholder-white/60 focus:ring-0 focus:outline-none h-full ${hasError ? 'placeholder-red-200' : ''}`}
          type="text"
          placeholder={hasError ? "Required!" : placeholder}
        />
      </div>
    );
  }

  const isTrueFalse = quiz?.questionType === 'TrueFalse';

  if (!displayQuestion) return <div>Loading...</div>;

  return (
    <div className="w-full h-full bg-gray-100 p-4 md:p-8 flex flex-col items-center custom-scrollbar overflow-y-auto">

      {/* Validation Error Banner Removed as per user request */}

      {/* Question Input */}
      <div className={`w-full bg-white rounded-xl shadow-card p-4 md:p-6 mb-4 md:mb-8 transition-all duration-300 ${validationError?.question ? 'ring-4 ring-red-500 border-red-500' : ''}`}>
        <input
          type="text"
          value={displayQuestion.question || ''}
          onChange={handleInputQuestion}
          placeholder={validationError?.question ? "Question text is required!" : "Start typing your question"}
          className={`w-full text-center text-xl md:text-3xl font-black text-gray-800 bg-transparent border-b-2 border-gray-200 focus:outline-none pb-2 md:pb-4 transition-colors ${validationError?.question ? 'placeholder-red-400 border-red-500' : 'placeholder-gray-300 focus:border-blue-500'}`}
        />
      </div>

      {/* Media Area */}
      <div className="w-full h-32 md:h-96 mb-4 md:mb-6">
        {displayQuestion.backgroundImage ? (
          <div className="w-full h-full relative group rounded-xl overflow-hidden shadow-lg">
            <img src={displayQuestion.backgroundImage} alt="Question" className="w-full h-full object-cover" />
            <button onClick={() => handleImage('')} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </div>
        ) : (
          <div className="w-full h-full bg-white rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative group cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
            <label className="cursor-pointer absolute inset-0 flex flex-col items-center justify-center z-10">
              <input
                type="file"
                accept="image/*"
                multiple={false}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      handleImage(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
            </label>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-blue-100 rounded-full flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-gray-500 font-bold group-hover:text-blue-600 transition-colors text-xs md:text-base">Add media</span>
          </div>
        )}
      </div>

      {/* Answer Options Grid */}
      <div className={`w-full grid ${isTrueFalse ? 'grid-cols-2 h-[120px] md:h-[150px]' : 'grid-cols-2 h-[160px] md:h-[200px]'} gap-2 md:gap-4`}>
        {renderOptionInput("option1", isTrueFalse ? "True" : "Add answer 1", "bg-red-500", "triangle")}
        {renderOptionInput("option2", isTrueFalse ? "False" : "Add answer 2", "bg-blue-500", "diamond")}
        {renderOptionInput("option3", "Add answer 3", "bg-yellow-500", "circle")}
        {renderOptionInput("option4", "Add answer 4", "bg-green-500", "square")}
      </div>

    </div >
  );
}

export default Mainbody;
