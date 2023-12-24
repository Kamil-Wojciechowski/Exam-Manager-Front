import React from "react";
import { Form } from "react-bootstrap";

const SingleAnswer = ({ question, answers, setAnswers }) => {
  const handleSingleAnswerChange = (selectedAnswerId) => {
    const updatedAnswers = [
      ...answers.filter((a) => a.id !== question.id), 
      {
        id: question.id,
        answer: [
          {
            questionAnswer: {
              id: selectedAnswerId,
            },
          },
        ],
      },
    ];

    setAnswers(updatedAnswers);
  };

  return (
    <div>
      <p>{question.question.question}</p>

        {question.question.answers.map((answer) => (
          <Form.Check
            key={answer.id}
            type="radio"
            id={`answer-${answer.id}`}
            label={answer.answer}
            checked={answers.some((a) => a.id === question.id && a.answer[0]?.questionAnswer.id === answer.id)}
            onChange={() => handleSingleAnswerChange(answer.id)}
          />
        ))}

    </div>
  );
};

export default SingleAnswer;
