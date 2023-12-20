import { useParams } from "react-router-dom";
import useAuthNavigate from "../js/AuthNavigate";
import { useEffect, useState } from "react";
import axios from "../js/AxiosInstance";
import toastr from 'toastr';
import { Button, Form, Modal, Table } from "react-bootstrap";

const StudiesExams = ({ authState }) => {
    useAuthNavigate(authState.isAuthenticated, true);

    const { studiesId } = useParams();

    const [formData, setFormData] = useState({
        name: '',
        questionMetadataId: '',
        startAt: '',
        endAt: '',
        questionPerUser: 0,
    });

    const [exams, setExams] = useState([]);
    const [databases, setDatabases] = useState([]);
    const [owner, setOwner] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [state, setState] = useState(1);

    useEffect(() => {
        const getExams = async () => {
            await axios.get("/studies/" + studiesId + "/exams", {
                params: {
                    orderBy: "startAt",
                    order: "desc"
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
    }, [owner, state]);

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

    const handleSubmit = async () => {
        console.log(formData);

        const questionMetadataId = parseInt(formData.questionMetadataId, 10);


        const examData = {
            name: formData.name,
            questionMetadata: {
              id: questionMetadataId,
            },
            startAt: formData.startAt,
            endAt: formData.endAt,
            questionPerUser: formData.questionPerUser,
          };
      
          await axios.post(`/studies/${studiesId}/exams`, examData).then(res => {
            toastr.success("Sukces");
            setState(state+1);
            setShowModal(false);

        }).catch(error => {
            toastr.error(error.response.data.message);
        })
    };

    return (
        <div className='center-main centered-element'>
            <div className='centered-element'>
                <Button hidden={!owner} onClick={() => { setShowModal(true); }} >Dodaj</Button>
                <Table striped>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nazwa</th>
                            <th>Rozpoczęcie</th>
                            <th>Zakończenie</th>
                            {owner && <th>Opcje</th>}
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
                                    {owner && <td>Opcje</td>}
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>

            <Modal show={showModal} onHide={() => { setShowModal(false); }}>
                <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <Modal.Header>
                        Egzamin
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter exam name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formQuestionMetadataId">
                                <Form.Label>Question Metadata ID</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="questionMetadataId"
                                    value={formData.questionMetadataId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select Question Metadata</option>
                                    {databases.map((database) => (
                                        <option key={database.id} value={database.id}>
                                            {database.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                        <Form.Group controlId="formStartAt">
                            <Form.Label>Start At</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="startAt"
                                value={formData.startAt}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formEndAt">
                            <Form.Label>End At</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="endAt"
                                value={formData.endAt}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formQuestionPerUser">
                            <Form.Label>Questions Per User</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter number of questions per user"
                                name="questionPerUser"
                                value={formData.questionPerUser}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { setShowModal(false); }}>Zamknij</Button>
                        <Button variant="primary" type="submit">Dodaj</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}

export default StudiesExams;