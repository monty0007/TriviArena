import React, { useContext } from 'react';
import { Question } from '../../context/QuestionContext';
import { useNavigate } from 'react-router-dom';

function Answers() {
  const { mainQuestion } = useContext(Question);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#2563eb] font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-white shadow-text-sm">Correct Answers</h1>
          <button onClick={() => navigate('/dashboard')} className="px-6 py-2 rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors text-sm font-bold shadow-button active:shadow-button-active active:translate-y-1">
            Exit
          </button>
        </div>

        <div className="space-y-6">
          {mainQuestion && mainQuestion.map((question, questionIndex) => (
            <div key={questionIndex} className="bg-white rounded-2xl p-6 shadow-card">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{questionIndex + 1}. {question.question}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.answerList.map((answer, answerIndex) => (
                  <div
                    key={answerIndex}
                    className={`
                        p-4 rounded-lg font-bold flex items-center gap-3 border-2
                        ${answer.isCorrect
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : 'bg-gray-50 border-transparent text-gray-400 opacity-70'}
                      `}
                  >
                    {answer.isCorrect && <span className="text-green-600 text-xl">✓</span>}
                    <span>{answer.body}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {mainQuestion && mainQuestion.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p>No questions found to review.</p>
            </div>
          )}
        </div>
      </div>
    </div >
  );
}

export default Answers;
