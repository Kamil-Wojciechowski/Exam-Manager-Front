import { useParams } from "react-router-dom";
import useAuthNavigate from "../js/AuthNavigate";
import { useEffect, useState } from "react";
import axios from "../js/AxiosInstance";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { FaCheck, FaEdit } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import { IoTrashBin } from "react-icons/io5";
import toastr from 'toastr';
import { useTranslation } from "react-i18next";



const DatabaseQuestionAnswer = ({ authState }) => {
    useAuthNavigate(authState.isAuthenticated, true, authState.isTeacher, true);
    
    const { t } = useTranslation();
    const { databaseId, questionId } = useParams();
    const [answers, setAnswers] = useState([]);
    const [state, setState] = useState(1);
    const [formData, setFormData] = useState({
        answer: "",
        correct: false
    });

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    const getAnswers = async () => {
        axios.get("/questions/metadata/" + databaseId + "/questions/" + questionId).then(res => {
            setAnswers(res.data.data.answers);
        });
    }

    useEffect(() => {
        getAnswers();
    }, [state]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const clearForm = () => {
        setFormData(
            {
                answer: "",
                correct: false
            }
        );
    }

    const handleForm = async () => {
        if (!formData.id) {
            await axios.post("/questions/metadata/" + databaseId + "/questions/" + questionId + "/answers", formData).then(res => {
                setShowModal(false);
                clearForm();
                setState(state + 1);
                toastr.success(t('success'));
            }).catch(error => {
                toastr.error(error.response.data.message);
            });
        } else {
            await axios.patch("/questions/metadata/" + databaseId + "/questions/" + questionId + "/answers/" + formData.id, formData).then(res => {
                setShowModal(false);
                clearForm();
                setState(state + 1);
                toastr.success(t('success'));
            }).catch(error => {
                toastr.error(error.response.data.message);
            });
        }
    }

    const triggerEdit = (item) => {
        setFormData(item);
        setShowModal(true);
    }

    const triggerDelete = (item) => {
        setFormData(item);
        setShowDeleteModal(true);
    }

    const handleDelete = async () => {
        await axios.delete("/questions/metadata/" + databaseId + "/questions/" + questionId + "/answers/" + formData.id).then(res => {
            handleCloseDeleteModal();
            setState(state + 1);
            toastr.success(t('success'));
        }).catch(error => {
            toastr.error(error.response.data.message);
        });
    }

    const handleCloseDeleteModal = () => {
        clearForm();
        setShowDeleteModal(false);
    }

    return (
        <div className='center-main centered-element'>
            <div className='centered-element'>
                <Button onClick={() => { setShowModal(true); }}>{t('add')}</Button>
                <Table striped>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t('answer')}</th>
                            <th>{t('correct')}</th>
                            <th>{t('options')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {answers.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.answer}</td>
                                <td>{item.correct ? <FaCheck /> : <HiXMark />}</td>
                                <td>
                                    <FaEdit onClick={() => { triggerEdit(item) }}></FaEdit>
                                    <IoTrashBin onClick={() => { triggerDelete(item); }} />
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </Table>
            </div>

            <Modal show={showModal} onHide={() => { setShowModal(false); }}>
                <Form onSubmit={(e) => { e.preventDefault(); handleForm(); }} >
                    <Modal.Header>
                        {t('answer')}
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formAnswer">
                            <Form.Label>{t('answer')}:</Form.Label>
                            <Form.Control
                                type="text"
                                name="answer"
                                value={formData.answer}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formCorrect">
                            <Form.Check
                                type="checkbox"
                                name="correct"
                                label={t('correct')}
                                checked={formData.correct}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { setShowModal(false); }}>{t('close')}</Button>
                        <Button type="submit">{formData.id ? t('edit') : t('add')}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => { handleCloseDeleteModal(); }} >
                <Modal.Header>
                    {t('question')}
                </Modal.Header>
                <Modal.Body>
                    {t('do_you_want_delete_this')}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {handleCloseDeleteModal(); }}>{t('close')}</Button>
                    <Button onClick={() => { handleDelete(); }}>{t('remove')}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DatabaseQuestionAnswer;