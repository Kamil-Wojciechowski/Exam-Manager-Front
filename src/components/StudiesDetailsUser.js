import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import axios from '../js/AxiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import toastr from 'toastr';
import AuthNavigate from '../js/AuthNavigate';
import StudiesForm from './forms/StudiesForm';
import { FaCrown } from "react-icons/fa";
import { TiUserDelete } from "react-icons/ti";
import StudiesUserForm from './forms/StudiesUserForm';



const StudiesDetailsUser = ({ authState }) => {
    const { studiesId } = useParams();
    const navigate = useNavigate();
    const [refreshKey, setRefreshKey] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [showUserDeleteModal, setUserDeleteModal] = useState(false);
    const [showUserImportModal, setUserImportModal] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showUsers, setShowUsers] = useState(true);
    const [studiesUser, setStudiesUser] = useState({
        id: null,
        user: {
            name: null
        }
    })
    const [selectedOption, setSelectedOption] = useState('csv');
    const [file, setFile] = useState(null);


    AuthNavigate(authState.isAuthenticated, true);

    const [formData, setFormData] = useState({
        name: '',
        classroomId: '',
        classroomName: '',
        owner: false
    })

    const [users, setUsers] = useState([]);

    const getStudies = async () => {
        await axios.get("/studies/" + studiesId).then((res) => {
            setFormData(res.data.data);
        });
    }

    const getUsers = async () => {
        await axios.get("/studies/" + studiesId + "/users").then((res) => {
            setUsers(res.data.data);
        });
    }

    useEffect(() => {
        if (isNaN(+studiesId)) {
            navigate("/");
            return;
        }

        getStudies();

        getUsers();
    }, [refreshKey]);

    const handleDelete = async () => {
        await axios.delete("/studies/" + studiesId).then(res => {
            toastr.success("Item deleted");
            navigate("/");
        }).catch(error => {
            toastr.error(error.response.data.message);
        });
    }

    const handleUserDelete = async () => {
        await axios.delete("/studies/" + studiesId + "/users/" + studiesUser.id).then(res => {
            toastr.success("Item deleted");
            setUserDeleteModal(false);
            setRefreshState();
        }).catch(error => {
            toastr.error(error.response.data.message);
        });
    }


    const openDeleteModal = () => {
        setDeleteModal(true);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setShowUserModal(false);
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleFormSubmit = async () => {

        if (selectedOption === 'google') {
            await axios.post("/studies/" + studiesId + "/users/imports/google").then(res => {
                toastr.success("Sucess!");
                setUserImportModal(false);
                setRefreshState();
            }).catch(error => {
                toastr.error(error.response.data.message);
            });
        } else if (selectedOption === 'csv') {
            if (!file) {
                toastr.error('Please provide a file');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            
            await axios.post("/studies/"+ studiesId +"/users/imports/csv", formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }).then(res => {
                toastr.success("Success!");
                setUserImportModal(false);
                setRefreshState();
            }).catch(error => {
                toastr.error(error.response.data.message);
            });
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const setRefreshState = () => {
        setRefreshKey(prevKey => prevKey + 1);
    }

    return (
        <div className='center-main centered-element'>
            <div className='centered-element'>
                <Button type="button" hidden={showUsers} onClick={() => { setShowDetails(false); setShowUsers(true) }}>Show details</Button>
                <Button type="button" hidden={showDetails} onClick={() => { setShowDetails(true); setShowUsers(false) }}>Show Users</Button>

                <div hidden={showDetails}>
                    {formData.owner && <Button type='button' onClick={() => { openModal() }}>Edit</Button>}
                    {formData.owner && <Button type='button' onClick={() => { openDeleteModal() }}>Delete</Button>}

                    <p>Nazwa:</p>
                    <p>{formData.name}</p>
                    <StudiesForm authState={authState} studiesData={formData} studiesId={studiesId} isCreate={false} showModal={showModal} closeModal={closeModal}></StudiesForm>
                    {
                        (formData.classroomName) ?
                            <>
                                <p>Classroom:</p>
                                <p>{formData.classroomName}</p>
                            </>
                            :
                            <>
                            </>
                    }
                </div>

                <Modal show={showDeleteModal} onHide={() => setDeleteModal(false)}>
                    <Modal.Header>
                        Grupa
                    </Modal.Header>
                    <Modal.Body>
                        Czy chcesz usunąć grupę {formData.name}?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="main_button" variant='primary' onClick={handleDelete}>
                            Usuń
                        </Button>
                    </Modal.Footer>
                </Modal>


                <div hidden={showUsers}>
                    {formData.owner && <Button type="button" onClick={() => { setShowUserModal(true); }}>Add User</Button>}
                    {formData.owner && <Button type="button" onClick={() => { setUserImportModal(true); }}>Import Users</Button>}
                    {(users.length === 0) ?
                        <div>
                            No users, please add some
                        </div> :
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Firstname</th>
                                    <th>Lastname</th>
                                    {formData.owner && <th>Options</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td>{item.owner && <FaCrown size={25} />} {item.user.firstname}</td>
                                        <td>{item.user.lastname}</td>
                                        {(formData.owner && item.user.id != authState.user.id) && <td>
                                            <TiUserDelete onClick={() => {
                                                setStudiesUser(item);
                                                setUserDeleteModal(true)
                                            }}></TiUserDelete>
                                        </td>}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    }

                    <Modal show={showUserDeleteModal} onHide={() => setUserDeleteModal(false)}>
                        <Modal.Header>
                            Użytkownik grupy {formData.name}
                        </Modal.Header>
                        <Modal.Body>
                            Czy chcesz usunąć użytkownika {studiesUser.user.firstname} z grupy?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="main_button" variant='primary' onClick={() => { handleUserDelete() }}>
                                Usuń
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showUserImportModal} onHide={() => setUserImportModal(false)}>

                        <Form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
                            <Modal.Header>
                                Zaimportuj użytkowników.
                            </Modal.Header>
                            <Modal.Body>

                                <Form.Group controlId="formOption">
                                    <Form.Label>Wybierz opcję:</Form.Label>
                                    <Form.Control as="select" value={selectedOption} onChange={handleOptionChange}>
                                        <option value="csv">CSV</option>
                                        {authState.user.googleConnected && <option value="google">Google</option>}
                                    </Form.Control>
                                </Form.Group>

                                {selectedOption === 'csv' && (
                                    <Form.Group controlId="formCsvFile">
                                        <Form.Label>Dołącz plik CSV:</Form.Label>
                                        <Form.Control type="file" onChange={handleFileChange} />
                                    </Form.Group>
                                )}



                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" type="submit">
                                    Wyślij żądanie
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>

                    <StudiesUserForm showModal={showUserModal} closeModal={closeModal} addedUsers={users} studiesId={studiesId} />

                </div>
            </div>
        </div>
    )
}

export default StudiesDetailsUser;
