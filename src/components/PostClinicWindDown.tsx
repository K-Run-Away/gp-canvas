'use client';

import { useState } from 'react';

const questions = [
  {
    id: 1,
    text: "Anything urgent outstanding to do before you leave?",
    placeholder: "Type your thoughts here..."
  },
  {
    id: 2,
    text: "How are you feeling right now?",
    placeholder: "Describe how you're feeling..."
  },
  {
    id: 3,
    text: "What was the hardest part about your clinic?",
    placeholder: "Share what was challenging..."
  },
  {
    id: 4,
    text: "What are you grateful for about your clinic?",
    placeholder: "What went well today?"
  },
  {
    id: 5,
    text: "Did you make even a small positive difference in 1 patient's day to day life today?",
    placeholder: "Reflect on your impact..."
  },
  {
    id: 6,
    text: "What would you need to do to be able to let the clinic 'go'?",
    placeholder: "What would help you transition?"
  }
];

export default function PostClinicWindDown() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers(Array(questions.length).fill(''));
    setIsComplete(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Post-Clinic Wind Down</h2>
      
      {!isComplete ? (
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mb-4">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentQuestionIndex
                    ? 'bg-blue-500'
                    : index < currentQuestionIndex
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Current Question */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              {questions[currentQuestionIndex].text}
            </h3>
            
            <textarea
              value={answers[currentQuestionIndex]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder={questions[currentQuestionIndex].placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            />

            {/* Next Button */}
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Thank you for your reflection</h3>
            <p className="text-gray-500">Take a moment to review your answers:</p>
          </div>
          
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{question.text}</h4>
                <p className="mt-2 text-gray-600">{answers[index] || 'No answer provided'}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 