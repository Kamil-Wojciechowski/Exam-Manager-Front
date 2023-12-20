import { useNavigate, useParams } from "react-router-dom";
import useAuthNavigate from "../js/AuthNavigate";
import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import Pagination from "./general/Pagination";
import axios from "../js/AxiosInstance";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import toastr from 'toastr';
import { FaEdit, FaCheck } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import { IoTrashBin } from "react-icons/io5";
import { MdOutlineQuestionAnswer } from "react-icons/md";




const DatabaseQuestion = ({ authState }) => {
    useAuthNavigate(authState.isAuthenticated, true, authState.isTeacher, true);

    const { t } = useTranslation();
    const { databaseId } = useParams();
    const navigate = useNavigate();

    const [pageDetails, setPageDetails] = useState({
        page: 1,
        pages: 0
    });
    const [questions, setQuestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [importModal, setImportModal] = useState();
    const [questionsTypes, setQuestionsTypes] = useState([]);
    const [state, setState] = useState(1);
    const [edit, setEdit] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemId, setItemId] = useState(0);
    const [file, setFile] = useState(null);

    const [formData, setFormData] = useState({
        "id": "",
        "question": "",
        "questionType": "SINGLE_ANSWER"
    })

    const handlePageChange = debounce((newPage) => {
        setPageDetails({
            ...pageDetails,
            page: newPage
        });
    }, 100);

    const getQuestionsType = async () => {
        await axios.get("/public/questions/types").then(res => {
            setQuestionsTypes(res.data.data);
        });
    }

    useEffect(() => {
        const getQuestions = async () => {
            await axios.get("/questions/metadata/" + databaseId + "/questions")
                .then(res => {
                    setQuestions(res.data.data);
                    setPageDetails({
                        page: res.data.page + 1,
                        pages: res.data.pages
                    });
                })
        };

        getQuestions();
        getQuestionsType();
    }, [state]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleOptionChange = (event) => {
        const selectedItem = event.target.value;

        setFormData((prevFormData) => ({
            ...prevFormData,
            questionType: selectedItem
        }));
    }

    const handleForm = async () => {
        if (edit) {
            await axios.put("/questions/metadata/" + databaseId + "/questions/" + formData.id, formData).then(
                res => {
                    toastr.success("Edited");
                    handleCloseModal();
                    setState(state + 1);
                }
            ).catch(error => {
                toastr.error(error.response.data.message);
            });
        } else {
            await axios.post("/questions/metadata/" + databaseId + "/questions", formData).then(
                res => {
                    toastr.success("Created");
                    handleCloseModal();
                    setState(state + 1);
                }
            ).catch(error => {
                toastr.error(error.response.data.message);
            });
        }
    }

    const handleEditModal = (itemDetails) => {
        setFormData(itemDetails);
        setEdit(true);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            "id": "",
            "question": "",
            "questionType": "SINGLE_ANSWER"
        });
        setEdit(false);
    }

    const handleDelete = async () => {
        await axios.delete("/questions/metadata/" + databaseId + "/questions/" + itemId).then(
            res => {
                toastr.success("Deleted");
                setShowDeleteModal(false);
                setState(state + 1);
            }
        )
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleImportForm = async () => {
        if (!file) {
            toastr.error('Please provide a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        
        await axios.post("/questions/metadata/" + databaseId + "/questions/imports", formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }).then(res => {
            toastr.success("Success!");
            setImportModal(false);
            setState(state + 1);
        }).catch(error => {
            toastr.error(error.response.data.message);
        });
    }

    return (
        <div className='center-main centered-element'>
            <div className='centered-element'>
                <Button onClick={() => { setShowModal(true) }}>Add</Button>
                <Button onClick={() => { setImportModal(true) }}>Import</Button>
                <Table striped>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Question</th>
                            <th>Typ</th>
                            <th>Poprawne</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {

                            questions.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.question}</td>
                                    <td>{item.questionType}</td>
                                    <td>{item.valid ? <FaCheck /> : <HiXMark />}</td>
                                    <td>
                                        <MdOutlineQuestionAnswer onClick={() => {
                                            navigate("/admin/database/" + databaseId + "/questions/" + item.id);

                                        }} />
                                        <FaEdit onClick={() => { handleEditModal(item); }}></FaEdit>
                                        <IoTrashBin onClick={() => { setShowDeleteModal(true); setItemId(item.id); }} />
                                    </td>
                                </tr>
                            ))

                        }
                    </tbody>
                </Table>
                <Pagination total={pageDetails.pages} currentPage={pageDetails.page} onPageChange={handlePageChange} />
            </div>


            <Modal show={showModal} onHide={() => (handleCloseModal())} >
                <Form onSubmit={(e) => { e.preventDefault(); handleForm(); }}>
                    <Modal.Header>
                        Pytanie
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group>
                            <Form.Label>
                                Pytanie:
                                <Form.Control type="text" name="question" value={formData.question} onChange={handleChange}></Form.Control>
                            </Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                <p>Typ:</p>
                                <Form.Control as="select" value={formData.questionType ? formData.questionType : ''} onChange={handleOptionChange}>
                                    <option value="" disabled>Select an item</option>
                                    {
                                        questionsTypes.map(item => (
                                            <option key={item} value={item}>{item}</option>
                                        ))
                                    }
                                </Form.Control>
                            </Form.Label>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { setShowModal(false) }}>Zamknij</Button>
                        <Button type="submit">{edit ? "Edytuj" : "Utwórz"}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => { setShowDeleteModal(false); setItemId(0); }} >
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

            <Modal show={importModal} onHide={() => setImportModal(false)}>

                <Form onSubmit={(e) => { e.preventDefault(); handleImportForm(); }}>
                    <Modal.Header>
                        Zaimportuj pytania.
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formCsvFile">
                            <Form.Label>Dołącz plik CSV:</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit">
                            Wyślij żądanie
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

        </div>
    )

}

export default DatabaseQuestion;