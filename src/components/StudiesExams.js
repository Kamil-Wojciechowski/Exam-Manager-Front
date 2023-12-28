import { useNavigate, useParams } from "react-router-dom";
import useAuthNavigate from "../js/AuthNavigate";
import { useEffect, useState } from "react";
import axios from "../js/AxiosInstance";
import toastr from 'toastr';
import { Button, Form, Modal, Table } from "react-bootstrap";
import { FaEdit, FaBackward, FaEye  } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import { useTranslation } from "react-i18next";


const StudiesExams = ({ authState }) => {
    useAuthNavigate(authState.isAuthenticated, true);

    
    const { studiesId } = useParams();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        questionMetadataId: '',
        startAt: '',
        endAt: '',
        questionPerUser: 0,
    });

    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [databases, setDatabases] = useState([]);
    const [owner, setOwner] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [archived, setArchived] = useState(false);
    const [state, setState] = useState(1);
    const [points, setPoints] = useState(0);
    const [maxPoints, setMaxPoints] = useState(0);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const getExams = async () => {
            await axios.get("/studies/" + studiesId + "/exams", {
                params: {
                    orderBy: "startAt",
                    order: "desc",
                    archived: archived
                }
            }).then(res => {
                setExams(res.data.data);
            })
        };

        const getOwner = async () => {
            await axios.get("/studies/" + studiesId).then((res) => {
                setOwner(res.data.data.owner);
            });
        };

        const fetchAllDatabases = async () => {
            let allDatabasesData = [];
            let currentPage = 0;
            let totalPages = 1;
        
            while (currentPage < totalPages) {
                await axios.get("/questions/metadata", {
                    params: {
                        page: currentPage,
                    },
                }).then((res) => {
                    const { data, pages } = res.data;
                    allDatabasesData = [...allDatabasesData, ...data];
                    totalPages = pages;
                    currentPage += 1;
                });
            }
        
            setDatabases(allDatabasesData);
        };

        getExams();
        getOwner();

        if(authState.isTeacher && owner) {
            fetchAllDatabases();
        }
    }, [owner, state, archived]);

    const formatDate = (dateString) => {
        if (dateString) {
            const date = new Date(dateString);
            return date.toLocaleString();
        }
        return "N/A";
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const prepareData = () => {
        const questionMetadataId = parseInt(formData.questionMetadataId, 10);

        return {
            name: formData.name,
            questionMetadata: {
              id: questionMetadataId,
            },
            archived: false,
            startAt: formData.startAt,
            endAt: formData.endAt,
            questionPerUser: formData.questionPerUser,
          };
    }

    const handleSubmit = async () => {
            const examData = prepareData();
      
          if(formData.id) {
            await axios.patch(`/studies/${studiesId}/exams/${formData.id}`, examData).then(res => {
                toastr.success(t('success'));
                setState(state+1);
                handleCloseModal();
    
            }).catch(error => {
                toastr.error(error.response.data.message);
            })
          } else {
            await axios.post(`/studies/${studiesId}/exams`, examData).then(res => {
                toastr.success(t('success'));
                setState(state+1);
                handleCloseModal();
    
            }).catch(error => {
                toastr.error(error.response.data.message);
            })
          }
          
    };

    const triggerEdit = (item) => {

        const examData = {
            id: item.id,
            name: item.name,
            questionMetadataId: item.questionMetadata.id,
            startAt: item.startAt,
            endAt: item.endAt,
            questionPerUser: item.questionPerUser,
          };

          setFormData(examData);
          setShowModal(true);
    }

    const clearForm = () => {
        setFormData({
            name: '',
            questionMetadataId: '',
            startAt: '',
            endAt: '',
            questionPerUser: 0,
        });
    }

    const handleCloseModal = () => {
        setShowModal(false);

        clearForm();
    }

    const triggerDelete = (item) => {
        setFormData(item);
        setShowDeleteModal(true);
    }

    const handleCloseDeleteModal = () => {
        clearForm();

        setShowDeleteModal(false);
    }

    const handleDelete = async () => {
        await axios.delete(`/studies/${studiesId}/exams/${formData.id}`).then(res => {
            toastr.success(t('success'));
            setState(state+1);
            handleCloseDeleteModal();

        }).catch(error => {
            toastr.error(error.response.data.message);
        })
    }

    const handleBack = async (item) => {

        const body = {
            name: item.name,
            questionMetadata: {
                id: item.questionMetadata.id
            },
            archived: false,
            startAt: item.startAt,
            endAt: item.endAt,
            questionPerUser: item.questionPerUser
          };


        await axios.patch(`/studies/${studiesId}/exams/${item.id}`, body).then(res => {
            toastr.success(t('success'));
            setState(state+1);
            setArchived(false);
            clearForm();
        }).catch(error => {
            toastr.error(error.response.data.message);
            clearForm();
        })
    }

    const isDateInRange = (startAt, endAt) => {
        const currentDate = new Date();
        const startDate = new Date(startAt);
        const endDate = new Date(endAt);

        return currentDate >= startDate && currentDate <= endDate;
    };

    const handleShowResult = async (examId) => {
        await axios.get(`/studies/${studiesId}/exams/${examId}`).then(res => {
            setPoints(res.data.data.points);
            setMaxPoints(res.data.data.questionPerUser * 2);
            setShowResults(true);
        }).catch(error => {
            toastr.error(error.response.data.message);
        })
    }

    return (
        <div className='center-main centered-element'>
            <div className='centered-element'>
                <Button hidden={!owner} onClick={() => { setShowModal(true); }} >Dodaj</Button>
                <Button hidden={!owner} onClick={() => { setArchived(!archived); }}>Zarchiwizowany</Button>
                <Table striped>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t('name')}</th>
                            <th>{t('starts')}</th>
                            <th>{t('ends')}</th>
                            <th>{t('options')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            exams.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{formatDate(item.startAt)}</td>
                                    <td>{formatDate(item.endAt)}</td>
                                    {owner && <td>
                                        <FaEye onClick={() => { navigate(`/studies/${studiesId}/exams/${item.id}`)}} />
                                        {!archived && <FaEdit onClick={() => { triggerEdit(item) }}></FaEdit>}
                                        {archived && <FaBackward onClick={() => { handleBack(item) }}/>}
                                        <IoTrashBin onClick={() => { triggerDelete(item); }} />

                                        </td>}
                                    {!owner && <td>
                                        <Button disabled={!isDateInRange(item.startAt, item.endAt)} onClick={() => {navigate(`/studies/${studiesId}/exams/${item.id}/participate`);}}>Start</Button>
                                        <Button disabled={!item.showResults} onClick={() => {handleShowResult(item.id)}}>{t('result')}</Button>
                                        </td>}
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>

            <Modal show={showModal} onHide={() => { handleCloseModal(); }}>
                <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <Modal.Header>
                        {t('exam')}
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formName">
                            <Form.Label>{t('name')}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={t('name')}
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formQuestionMetadataId">
                                <Form.Label>{t('database')}</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="questionMetadataId"
                                    value={formData.questionMetadataId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>{t('select')}</option>
                                    {databases.map((database) => (
                                        <option key={database.id} value={database.id}>
                                            {database.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                        <Form.Group controlId="formStartAt">
                            <Form.Label>{t('starts')}</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="startAt"
                                value={formData.startAt}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formEndAt">
                            <Form.Label>{t('ends')}</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="endAt"
                                value={formData.endAt}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formQuestionPerUser">
                            <Form.Label>{t('question_per_user')}</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder={t('question_per_user')}
                                name="questionPerUser"
                                value={formData.questionPerUser}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { handleCloseModal(); }}>{t('close')}</Button>
                        <Button variant="primary" type="submit">{formData.id ? t('edit') : t('add')}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => { handleCloseDeleteModal(); }} >
                <Modal.Header>
                    {t('exam')}
                </Modal.Header>
                <Modal.Body>
                    {t('do_you_want_delete_this')}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { handleDelete(); }}>Usuń</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showResults} onHide={() => {setShowResults(false)}}>
                <Modal.Header>
                    {t('result')}
                </Modal.Header>
                <Modal.Body>
                    {t('result_text')}: {points}/{maxPoints}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {setShowResults(false)}}>{t('close')}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default StudiesExams;