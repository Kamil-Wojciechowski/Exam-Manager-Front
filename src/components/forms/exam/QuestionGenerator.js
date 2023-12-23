import SingleAnswer from "./SingleAnswer";
import MultipleAnswer from "./MultipleAnswer";
import FileAnswer from "./FileAnswer";
import OpenAnswer from "./OpenAnswer";

const QuestionGenerator = ({ question, answers, setAnswers }) => {
    if (!question || !question.question || !question.question.questionType) {
        // Data is not available yet, return a loading message or placeholder
        return <p>Loading...</p>;
      }

    switch (question.question.questionType) {
      case "SINGLE_ANSWER":
        return <SingleAnswer question={question} answers={answers} setAnswers={setAnswers} />;
      case "MULTIPLE_ANSWERS":
        return <MultipleAnswer question={question} answers={answers} setAnswers={setAnswers} />;
      case "FILE":
        return <FileAnswer question={question} answers={answers} setAnswers={setAnswers} />;
      case "OPEN_ANSWER":
        return <OpenAnswer question={question} answers={answers} setAnswers={setAnswers} />;
      default:
        return null;
    }
  };

export default QuestionGenerator;