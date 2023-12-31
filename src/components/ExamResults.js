import { useEffect, useState } from "react";
import useAuthNavigate from "../js/AuthNavigate";
import axios from "../js/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import toastr from 'toastr';
import Pagination from "./general/Pagination";
import debounce from "lodash.debounce";
import { FaCheck } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import { Button, Modal, Table } from "react-bootstrap";
import { MdQuestionAnswer } from "react-icons/md";
import { useTranslation } from "react-i18next";



const ExamResults = ({ authState }) => {
    useAuthNavigate(authState.isAuthenticated, true, authState.isTeacher, true);

    const navigate = useNavigate();
    const { t } = useTranslation();
    const { studiesId, examId } = useParams();
    const [results, setResults] = useState([]);
    const [examDetails, setExamDetails] = useState({});
    const [pageDetails, setPageDetails] = useState({
        page: 1,
        pages: 0
    });
    const [showAnswerModal, setShowAnswerModal] = useState(false);
    const [item, setItem] = useState(0);
    const [expandedItem, setExpandedItem] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [answerCorrectOptions, setAnswerCorrectOptions] = useState([]);
    const [points, setPoints] = useState([]);
    const [changeItem, setChangeItem] = useState({});
    const [itemChanged, setItemChanged] = useState(0);
    const [sent, setSent] = useState(false);
    const [sendResults, setSendResults] = useState(false);


    const handlePageChange = debounce((newPage) => {
        setPageDetails({
            ...pageDetails,
            page: newPage
        });
    }, 100);

    const getExamGroups = async () => {
        await axios.get(`/studies/${studiesId}/exams/${examId}/groups`, {
            params: {
                page: pageDetails.page - 1
            }
        }).then(res => {
            setResults(res.data.data);
            setPageDetails({
                page: res.data.page + 1,
                pages: res.data.pages
            });

            if (item !== 0) {
                const itemPoints = res.data.data.filter(filterItem => filterItem.id === item)[0];
                setPoints(itemPoints.points ? itemPoints.points : 0);
            }

        }).catch(error => {
            toastr.error(error.response.data.message);
            navigate(`/studies/${studiesId}/exams`);
        })
    };

    useEffect(() => {
        const getExamDetails = async () => {
            await axios.get(`/studies/${studiesId}/exams/${examId}`).then(res => {
                setExamDetails(res.data.data);
            }).catch(error => {
                toastr.error(error.response.data.message);
                navigate(`/studies/${studiesId}/exams`);
            });
        };

        const getAnswerTypes = async () => {
            await axios.get(`/public/questions/answers/types`).then(res => {
                setAnswerCorrectOptions(res.data.data);
            });
        };

        getExamGroups();
        getExamDetails();
        getAnswerTypes();
    }, [pageDetails.page, itemChanged])

    useEffect(() => {
        const getAnswers = async () => {
            await axios.get(`/studies/${studiesId}/exams/${examId}/groups/${item}`).then(res => {
                setAnswers(res.data.data.examGroupQuestionList);
            }).catch(error => {
                toastr.error(error.response.data.message);
                setShowAnswerModal(false);
            })
        }

        if (item !== 0) {
            getAnswers();
        }
    }, [showAnswerModal, itemChanged]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            getExamGroups();
        }, 15000);

        return () => clearInterval(intervalId);
    }, [])


    const toggleExpandItem = (itemId) => {
        setChangeItem({});
        setPoints(points);
        setExpandedItem((prevExpandedItem) =>
            prevExpandedItem === itemId ? null : itemId
        );
    };

    const handleCorrectChange = (itemId, newValue) => {
        setChangeItem({
            correct: newValue,
            id: itemId
        })
    };

    const saveChanges = async () => {
        if (item !== 0 && changeItem.id) {
            const body = {
                correctType: changeItem.correct
            }

            await axios.patch(`/studies/${studiesId}/exams/${examId}/groups/${item}/questions/${changeItem.id}`, body).then(res => {
                toastr.success(t('success'));
                setItemChanged(itemChanged + 1)
            }).catch(error => {
                toastr.error(error.response.data.message);
            })
        }
    };

    const handleCloseModal = () => {
        setShowAnswerModal(false);
        setPoints(0);
        setItem(0);
        setChangeItem({});
        setExpandedItem(null);
    }

    const handleSendResults = async () => {
        await axios.post(`/studies/${studiesId}/exams/${examId}/submission`).then(res => {
            toastr.success(t('results_returned'));
            setSendResults(false);
        }).catch(error => {
            toastr.error(error.response.data.message);
        })
    }

    return (
        <div className='center-main'>
            <div className='centered-element'>
                <h2>{t('answers')}</h2>
                <Button className="main_button" onClick={() => { setSendResults(true) }}>{t('return')}</Button>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t('firstname')}</th>
                            <th>{t('lastname')}</th>
                            <th>{t('ip_address')}</th>
                            <th>{t('points')}</th>
                            <th>{t('started')}</th>
                            <th>{t('sent')}</th>
                            <th>{t('options')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {

                            results.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.studiesUser.user.firstname}</td>
                                    <td>{item.studiesUser.user.lastname}</td>
                                    <td>{item.studiesUser.user.ipAddress}</td>
                                    <td>{item.points ? item.points : 0}{"/" + (examDetails.questionPerUser * 2)}</td>
                                    <td>{item.started ? <FaCheck /> : <HiXMark />}</td>
                                    <td>{item.sent ? <FaCheck /> : <HiXMark />}</td>
                                    <td>
                                        <MdQuestionAnswer onClick={() => { setShowAnswerModal(true); setItem(item.id); setPoints(item.points ? item.points : 0); setSent(item.sent); }} />
                                    </td>
                                </tr>
                            ))

                        }
                    </tbody>
                </Table>
                <Pagination total={pageDetails.pages} currentPage={pageDetails.page} onPageChange={handlePageChange} />
            </div>

            <Modal size="xl" show={showAnswerModal} onHide={() => { handleCloseModal() }}>
                <Modal.Header>
                    {t('answers')}
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>
                            {t('points')}: {points}{"/" + (examDetails.questionPerUser * 2)}
                        </label>
                    </div>
                    <Table>
                        <thead>
                            <tr>
                                <th>{t('question')}</th>
                                {expandedItem && <th>{t('details')}</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {answers.map((item, index) => (
                                <tr key={index}>
                                    <td onClick={() => toggleExpandItem(item.id)}>{item.question.question}</td>
                                    {
                                        expandedItem === item.id &&
                                        <td>
                                            <label>
                                                {t('correct')}:
                                                <select className="form-select"
                                                    disabled={!sent}
                                                    value={changeItem.correct ? changeItem.correct : (item.correct ? item.correct : "NOT_CORRECT")}
                                                    onChange={(e) => { if (sent) handleCorrectChange(item.id, e.target.value) }}
                                                >
                                                    {answerCorrectOptions.map((option) => (
                                                        <option key={option} value={option}>
                                                            {t(option)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label><br />
                                            <label>
                                                {t('possible_answers')}:
                                                <ul>
                                                    {item.question.answers.map(answer => <li>{answer.answer}</li>)}

                                                </ul>
                                            </label><br />
                                            <label>
                                                {t('correct_answers')}:  <ul>{item.question.answers.filter(answer => answer.correct)
                                                    .map(correctAnswer => <li>{correctAnswer.answer}</li>)}
                                                </ul>
                                            </label><br />

                                            <label>
                                                {t('user_answers')}: <ul> {item.answer.length !== 0 ? item.answer.map(answer => <li>{answer.manualAnswer ? answer.manualAnswer : answer.questionAnswer.answer}</li>) : t('no_answer')}</ul> 
                                            </label><br />
                                            <label>
                                                {t('answer_changed')}: {item.changedManually ? <FaCheck /> : <HiXMark />}
                                            </label><br />
                                            {changeItem.id && <Button onClick={() => { saveChanges() }}>{t('edit')}</Button>}
                                        </td>
                                    }
                                </tr>
                            ))}

                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { handleCloseModal(); }}>{t('close')}</Button>

                </Modal.Footer>
            </Modal>

            <Modal show={sendResults} onHide={() => { setSendResults(false) }}>
                <Modal.Header>
                    {t('result')}
                </Modal.Header>
                <Modal.Body>
                    {t('do_you_want_give')} {t('results')}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setSendResults(false); }}>Zamknij</Button>
                    <Button className="main_button" onClick={() => { handleSendResults() }}>Wyślij</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}

export default ExamResults;
