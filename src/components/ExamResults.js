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



const ExamResults = ({ authState }) => {
    useAuthNavigate(authState.isAuthenticated, true, authState.isTeacher, true);

    const navigate = useNavigate();
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

            if(item !== 0) {
                const itemPoints = res.data.data.filter(filterItem => filterItem.id === item)[0];
                setPoints(itemPoints.points);
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
            console.log("hit");
            getExamGroups();
        }, 15000);

        return () => clearInterval(intervalId);
    }, [])


    const toggleExpandItem = (itemId) => {
        setChangeItem({});
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
                toastr.success("Item updated");
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
            toastr.success("Wyniki zostały zwrócone");
            setSendResults(false);
        }).catch(error => {
            toastr.error(error.response.data.message);
        })
    }

    return (
        <div className='center-main centered-element'>
            <div className='centered-element'>
                <Button onClick={() => {setSendResults(true)}}>Oddaj</Button>
                <Table striped>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Imie</th>
                            <th>Nazwisko</th>
                            <th>Adres IP</th>
                            <th>Punktacja</th>
                            <th>Rozpoczęte</th>
                            <th>Wysłane</th>
                            <th>Opcje</th>
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

            <Modal show={showAnswerModal} onHide={() => { handleCloseModal() }}>
                <Modal.Header>
                    Odpowiedzi
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>
                            Punktacja: {points}{"/" + (examDetails.questionPerUser * 2)}
                        </label>
                    </div>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>Pytanie</th>
                                {expandedItem && <th>Detale</th>}
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
                                                Correct:
                                                <select
                                                    disabled={!sent}
                                                    value={changeItem.correct ? changeItem.correct : (item.correct ? item.correct : "NOT_CORRECT")}
                                                    onChange={(e) => {if(sent) handleCorrectChange(item.id, e.target.value)}}
                                                >
                                                    {answerCorrectOptions.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label>
                                                Possible Answers: {item.question.answers.map(answer => answer.answer).join(", ")}
                                            </label>
                                            <label>
                                                Correct Answers:  {item.question.answers.filter(answer => answer.correct)
                                                    .map(correctAnswer => correctAnswer.answer)
                                                    .join(", ")}
                                            </label>
                                            <label>
                                                User Answered: {item.answer.map(answer => answer.questionAnswer.answer).join(", ")}
                                            </label>
                                            <label>
                                                Odpowiedz zmieniona: {item.changedManually ? <FaCheck/> : <HiXMark/>}
                                            </label>
                                            {changeItem.id && <Button onClick={() => { saveChanges() }}>Zapisz</Button>}
                                        </td>
                                    }
                                </tr>
                            ))}

                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>

            <Modal show={sendResults} onHide={() => {setSendResults(false)}}>
                <Modal.Header>
                    Wyniki
                </Modal.Header>
                <Modal.Body>
                    Czy chcesz oddać wyniki?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {setSendResults(false);}}>Zamknij</Button> 
                    <Button onClick={() => {handleSendResults()}}>Wyślij</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}

export default ExamResults;
