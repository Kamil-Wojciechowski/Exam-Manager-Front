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
            await axios.get("/questions/metadata/" + databaseId + "/questions", {
                params: {
                    page: pageDetails.page - 1,
                }
            })
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
    }, [state, pageDetails.page]);

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
                    toastr.success(t('success'));
                    handleCloseModal();
                    setState(state + 1);
                }
            ).catch(error => {
                toastr.error(error.response.data.message);
            });
        } else {
            await axios.post("/questions/metadata/" + databaseId + "/questions", formData).then(
                res => {
                    toastr.success(t('success'));
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
            toastr.error(t('provide_file'));
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
                <Button onClick={() => { setShowModal(true) }}>{t('add')}</Button>
                <Button onClick={() => { setImportModal(true) }}>Import</Button>
                <Table striped>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t('question')}</th>
                            <th>{t('type')}</th>
                            <th>{t('correct')}</th>
                            <th>{t('options')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {

                            questions.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.question}</td>
                                    <td>{t(item.questionType)}</td>
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
                        {t('question')}
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group>
                            <Form.Label>
                                {t('question')}:
                                <Form.Control type="text" name="question" value={formData.question} onChange={handleChange}></Form.Control>
                            </Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                <p>{t('type')}:</p>
                                <Form.Control as="select" value={formData.questionType ? formData.questionType : ''} onChange={handleOptionChange}>
                                    <option value="" disabled>Select an item</option>
                                    {
                                        questionsTypes.map(item => (
                                            <option key={item} value={item}>{t(item)}</option>
                                        ))
                                    }
                                </Form.Control>
                            </Form.Label>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { setShowModal(false) }}>{t('close')}</Button>
                        <Button type="submit">{edit ? t('edit') : t('add')}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => { setShowDeleteModal(false); setItemId(0); }} >
                <Modal.Header>
                    {t('question')}
                </Modal.Header>
                <Modal.Body>
                    {t('do_you_want_delete_this')}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { handleDelete(); }}>{t('remove')}</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={importModal} onHide={() => setImportModal(false)}>

                <Form onSubmit={(e) => { e.preventDefault(); handleImportForm(); }}>
                    <Modal.Header>
                        {t('import_questions')}
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formCsvFile">
                            <Form.Label>{t('csv_file')}:</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit">
                            Import
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

        </div>
    )

}

export default DatabaseQuestion;