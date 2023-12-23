import { useEffect, useState } from "react";
import useAuthNavigate from "../js/AuthNavigate";
import axios from "../js/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import toastr from 'toastr';
import Pagination from "./general/Pagination";
import debounce from "lodash.debounce";
import { FaCheck } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import { Modal, Table } from "react-bootstrap";
import { MdQuestionAnswer } from "react-icons/md";



const ExamResults = ({ authState }) => {
    useAuthNavigate(authState.isAuthenticated, true, authState.isTeacher, true);

    const navigate = useNavigate();
    const { studiesId, examId } = useParams();
    const [results, setResults] = useState([]);
    const [pageDetails, setPageDetails] = useState({
        page: 1,
        pages: 0
      });
    const [showAnswerModal, setShowAnswerModal] = useState(false);
    const [item, setItem] = useState(0);

    const [answers, setAnswers] = useState([]);

    const handlePageChange = debounce((newPage) => {
        setPageDetails({
            ...pageDetails,
            page: newPage
        });
    }, 100);

    useEffect(() => {
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
                console.log(res);
            }).catch(error => {
                toastr.error(error.response.data.message);
                navigate(`/studies/${studiesId}/exams`);
            })
        }

        getExamGroups();
    }, [pageDetails.page])

    useEffect(() => {
        const getAnswers = async () => {
            await axios.get(`/studies/${studiesId}/exams/${examId}/groups/${item}`).then(res => {
                setAnswers(res.data.data.examGroupQuestionList);
                console.log(res.data.data.examGroupQuestionList);
            }).catch(error => {
                toastr.error(error.response.data.message);
                setShowAnswerModal(false);
            })
        }

        if(item !== 0) {
            getAnswers();
        }
    }, [showAnswerModal])

    return (
        <div className='center-main centered-element'>
            <div className='centered-element'>
            <Table striped>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Imie</th>
                            <th>Nazwisko</th>
                            <th>Adres IP</th>
                            <th>Punktacja</th>
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
                                    <td>{item.points ? item.points : 0}</td>
                                    <td>{item.sent ? <FaCheck /> : <HiXMark />}</td>
                                    <td>
                                       <MdQuestionAnswer onClick={() => {setShowAnswerModal(true); setItem(item.id); }} />
                                    </td>
                                </tr>
                            ))

                        }
                    </tbody>
                </Table>
            <Pagination total={pageDetails.pages} currentPage={pageDetails.page} onPageChange={handlePageChange} />
            </div>

            <Modal show={showAnswerModal} onHide={() => {setShowAnswerModal(false)}}>
                <Modal.Header>

                </Modal.Header>
                <Modal.Body>
                <Table striped>
                    <thead>
                        <tr>
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {answers.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                            </tr>
                        ))}

                    </tbody>
                </Table>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </div>
    );

}

export default ExamResults;
