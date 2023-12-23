import { Form } from "react-bootstrap";

const OpenAnswer = ({ question }) => {
    // Render form for open answer question
    return (
      <Form.Group>
        <Form.Label>{question.question.question}</Form.Label>
        <Form.Control as="textarea" rows={4} placeholder="Enter your answer" />
      </Form.Group>
    );
  };

export default OpenAnswer;