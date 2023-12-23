import { Form } from "react-bootstrap";

const FileAnswer = ({ question }) => {
    return (
      <Form.Group>
        <Form.Label>{question.question.question}</Form.Label>
        <Form.Control type="file" />
      </Form.Group>
    );
  };

export default FileAnswer;