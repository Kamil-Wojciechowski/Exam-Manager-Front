import { useNavigate, useParams } from "react-router-dom";
import useAuthNavigate from "../js/AuthNavigate";
import { useEffect, useState } from "react";
import axios from "../js/AxiosInstance";
import { Button, Col, Form, Row } from "react-bootstrap";
import QuestionGenerator from "./forms/exam/QuestionGenerator";
import toastr from 'toastr';
import { useTranslation } from "react-i18next";


const ExamParticipate = ({ authState }) => {
    useAuthNavigate(authState.isAuthenticated, true, authState.isTeacher, false);

    const { t } = useTranslation();
    const navigate = useNavigate();

    const { studiesId, examId } = useParams();

    const [pageDetails, setPageDetails] = useState({
        page: 0,
        pages: 0
    });
    const [question, setQuestion] = useState({

    });
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const storedAnswers = localStorage.getItem("examAnswers");
        if (storedAnswers) {
          setAnswers(JSON.parse(storedAnswers));
        }

        const getQuestions = async () => {
            await axios.get(`/studies/${studiesId}/exams/${examId}/groups/questions/participate`, {
                params: {
                    page: pageDetails.page
                }
            }).then(res => {
                setQuestion(res.data.data[0]);
                setPageDetails({
                    page: pageDetails.page,
                    pages: res.data.pages
                });
            }).catch(error => {
                toastr.error(error.response.data.message);
                navigate(`/studies/${studiesId}/exams`);
            });
        };

        getQuestions();

    }, [pageDetails.page]);

    const handlePageChange = (newPage) => {
        localStorage.setItem("examAnswers", JSON.stringify(answers));

        setPageDetails({
            ...pageDetails,
            page: newPage,
        });
    };

    const handleUp = () => {
        handlePageChange(pageDetails.page + 1);
    }

    const handleDown = () => {
        handlePageChange(pageDetails.page - 1);
    }

    const handleSend = async () => {
        await axios.post(`/studies/${studiesId}/exams/${examId}/groups/questions/participate`, answers).then(res => {
            toastr.success("Sukces");
            navigate(`/studies/${studiesId}/exams`);
            localStorage.removeItem("examAnswers");
        }).catch(error => {
            toastr.error(error.response.data.message);
        })
    }

    return (
        <div className='center-main'>
            <div className='centered-element'>
                <Row>
                    {[...Array(pageDetails.pages).keys()].map((pageNumber) => (
                        <Col key={pageNumber}>
                            <div onClick={() => handlePageChange(pageNumber)}>
                                {pageNumber + 1}
                            </div>
                        </Col>
                    ))}
                </Row>

                <Button className="main_button" disabled={pageDetails.page === 0} onClick={() => { handleDown(); }} >{t('previous')}</Button>
                <Button className="main_button" disabled={pageDetails.page === pageDetails.pages - 1} onClick={() => { handleUp(); }}>{t('next')}</Button>
                { pageDetails.page === pageDetails.pages - 1 && <Button className="main_button" onClick={() => handleSend()}>{t('send')}</Button> }
                <Form>
                    {question.question && (
                        <QuestionGenerator question={question} answers={answers} setAnswers={setAnswers}></QuestionGenerator>
                    )}
                </Form>
            </div>
        </div>
    );
}

export default ExamParticipate;