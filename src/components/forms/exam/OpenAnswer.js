import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const OpenAnswer = ({ question }) => {
  const { t } = useTranslation();
  

    return (
      <Form.Group>
        <Form.Label>{question.question.question}</Form.Label>
        <Form.Control as="textarea" rows={4} placeholder={t('enter_answer')} />
      </Form.Group>
    );
  };

export default OpenAnswer;