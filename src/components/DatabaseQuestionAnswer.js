import { useParams } from "react-router-dom";
import useAuthNavigate from "../js/AuthNavigate";
import { useEffect, useState } from "react";
import axios from "../js/AxiosInstance";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { FaCheck, FaEdit } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import { IoTrashBin } from "react-icons/io5";
import toastr from 'toastr';



const DatabaseQuestionAnswer = ({ authState }) => {
    useAuthNavigate(authState.isAuthenticated, true, authState.isTeacher, true);
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
                toastr.success("Utworzono");
            }).catch(error => {
                toastr.error(error.response.data.message);
            });
        } else {
            await axios.patch("/questions/metadata/" + databaseId + "/questions/" + questionId + "/answers/" + formData.id, formData).then(res => {
                setShowModal(false);
                clearForm();
                setState(state + 1);
                toastr.success("Zaaktualizowano");
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
            toastr.success("Usunięto");
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
                <Button onClick={() => { setShowModal(true); }}> Add</Button>
                <Table striped>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Odpowiedż</th>
                            <th>Poprawna</th>
                            <th>Opcje</th>
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
                        Odpowiedź
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formAnswer">
                            <Form.Label>Answer:</Form.Label>
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
                                label="Correct"
                                checked={formData.correct}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { setShowModal(false); }}>Zamknij</Button>
                        <Button type="submit">{formData.id ? "Edytuj" : "Utwórz"}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => { handleCloseDeleteModal(); }} >
                <Modal.Header>
                    Pytanie
                </Modal.Header>
                <Modal.Body>
                    Czy chcesz usunąć dany element?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { handleDelete(); }}>Usuń</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DatabaseQuestionAnswer;