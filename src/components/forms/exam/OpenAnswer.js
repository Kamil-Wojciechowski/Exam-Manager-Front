import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const OpenAnswer = ({ question, answers, setAnswers }) => {
  const { t } = useTranslation();
  const [manualAnswer, setManualAnswer] = useState(""); // State to track the manual answer

  const handleManualAnswerChange = (event) => {
    const newManualAnswer = event.target.value;

    setManualAnswer(newManualAnswer);

    const updatedAnswers = [
      ...answers.filter((a) => a.id !== question.id),
      {
        id: question.id,
        answer: [
          {
            manualAnswer: newManualAnswer,
          },
        ],
      },
    ];

    setAnswers(updatedAnswers);
  };

  useEffect(() => {
    const currentItem = answers.filter((a) => a.id === question.id)[0];

    if(currentItem) {
      setManualAnswer((currentItem.answer[0].manualAnswer) ? currentItem.answer[0].manualAnswer : "");
    }
  }, [answers]);

  return (
    <Form.Group>
      <Form.Label>{question.question.question}</Form.Label>
      <Form.Control
        className="left-main"
        as="textarea"
        rows={4}
        placeholder={t('enter_answer')}
        value={manualAnswer}
        onChange={handleManualAnswerChange}
      />
    </Form.Group>
  );
};

export default OpenAnswer;
