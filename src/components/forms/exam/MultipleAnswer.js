// MultipleAnswer.js

import React, { useState } from "react";
import { Form } from "react-bootstrap";

const MultipleAnswer = ({ question, answers, setAnswers }) => {
  const handleCheckboxChange = (answerId) => {
    const questionIndex = answers.findIndex((q) => q.id === question.id);

    // If the question is not present, add it with the selected answer
    // If the question is already present, update its selected answers
    const updatedAnswers = [...answers];
    if (questionIndex === -1) {
      updatedAnswers.push({
        id: question.id,
        answer: [{ questionAnswer: { id: answerId } }],
      });
    } else {
      const questionAnswers = updatedAnswers[questionIndex].answer;
      const answerIndex = questionAnswers.findIndex(
        (a) => a.questionAnswer.id === answerId
      );

      // If the answer is not present, add it; otherwise, remove it
      if (answerIndex === -1) {
        questionAnswers.push({ questionAnswer: { id: answerId } });
      } else {
        questionAnswers.splice(answerIndex, 1);
      }
    }

    // Update the state with the new answers array
    setAnswers(updatedAnswers);
  };

  return (
    <Form.Group>
      <Form.Label>{question.question.question}</Form.Label>
      {question.question.answers.map((answer) => (
        <Form.Check 
          className="left-main"
          key={answer.id}
          type="checkbox"
          id={`answer-${answer.id}`}
          label={answer.answer}
          checked={
            answers.some(
              (q) =>
                q.id === question.id &&
                q.answer.some((a) => a.questionAnswer.id === answer.id)
            )
          }
          onChange={() => handleCheckboxChange(answer.id)}
        />
      ))}
    </Form.Group>
  );
};

export default MultipleAnswer;
