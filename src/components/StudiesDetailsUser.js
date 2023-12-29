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
import { useTranslation } from 'react-i18next';



const StudiesDetailsUser = ({ authState }) => {
    const { studiesId } = useParams();
    const { t } = useTranslation();
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
            toastr.success(t('success'));
            navigate("/");
        }).catch(error => {
            toastr.error(error.response.data.message);
        });
    }

    const handleUserDelete = async () => {
        await axios.delete("/studies/" + studiesId + "/users/" + studiesUser.id).then(res => {
            toastr.success(t('success'));
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
                toastr.success(t('success'));
                setUserImportModal(false);
                setRefreshState();
            }).catch(error => {
                toastr.error(error.response.data.message);
            });
        } else if (selectedOption === 'csv') {
            if (!file) {
                toastr.error(t('provide_file'));
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            
            await axios.post("/studies/"+ studiesId +"/users/imports/csv", formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }).then(res => {
                toastr.success(t('success'));
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
        <div className='center-main'>
            
            <Button className="main_button" type="button" hidden={showUsers} onClick={() => { setShowDetails(false); setShowUsers(true) }}>{t('details')}</Button>
            <Button className="main_button" type="button" hidden={showDetails} onClick={() => { setShowDetails(true); setShowUsers(false) }}>{t('users')}</Button>
            <Button className="main_button" onClick={() => {navigate("/studies/" + studiesId + "/exams")}}>{t('exams')}</Button>
                
             
                
            <div className='centered-element'>

                <div hidden={showDetails}>
                    <h2>{t('details')}</h2>
                    <p>{t('name')}: {formData.name}</p>
                    <StudiesForm authState={authState} studiesData={formData} studiesId={studiesId} isCreate={false} showModal={showModal} closeModal={closeModal}></StudiesForm>
                    {
                        (formData.classroomName) ?
                        <>
                                <p>Classroom: {formData.classroomName}</p>
                            </>
                            :
                            <>
                            </>
                    }
                    {formData.owner && <Button className="main_button" type='button' onClick={() => { openModal() }}>{t('edit')}</Button>}
                    {formData.owner && <Button className="main_button" type='button' onClick={() => { openDeleteModal() }}>{t('remove')}</Button>}
                </div>

                <Modal show={showDeleteModal} onHide={() => setDeleteModal(false)}>
                    <Modal.Header>
                        {t('group')}
                    </Modal.Header>
                    <Modal.Body>
                        {t('do_you_want_delete')} {formData.name}?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="main_button" variant='primary' onClick={handleDelete}>
                            {t('remove')}
                        </Button>
                    </Modal.Footer>
                </Modal>


                <div hidden={showUsers}>
                    <h2>{t('users')}</h2>
                    {formData.owner && <Button className="main_button" type="button" onClick={() => { setShowUserModal(true); }}>{t('add')}</Button>}
                    {formData.owner && <Button className="main_button" type="button" onClick={() => { setUserImportModal(true); }}>Import</Button>}
                    {(users.length === 0) ?
                        <div>
                            {t('no_users')}
                        </div> :
                        <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>{t('firstname')}</th>
                                    <th>{t('lastname')}</th>
                                    <th>Email</th>
                                    <th>{formData.owner && t('options')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td>{item.owner && <FaCrown size={25} />} {item.user.firstname}</td>
                                        <td>{item.user.lastname}</td>
                                        <td>{item.user.email}</td>
                                        <td>
                                        {(formData.owner && item.user.id !== authState.user.id) && 
                                            <TiUserDelete onClick={() => {
                                                setStudiesUser(item);
                                                setUserDeleteModal(true)
                                            }}></TiUserDelete>
                                        }</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    }

                    <Modal show={showUserDeleteModal} onHide={() => setUserDeleteModal(false)}>
                        <Modal.Header>
                            {t('user')} {formData.name}
                        </Modal.Header>
                        <Modal.Body>
                            {t('do_you_want_delete')} {studiesUser.user.firstname}?
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant='secondary' onClick={() => { setUserDeleteModal(false) }}>
                                {t('close')}
                            </Button>
                            <Button className="main_button" variant='primary' onClick={() => { handleUserDelete() }}>
                                {t('remove')}
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showUserImportModal} onHide={() => setUserImportModal(false)}>

                        <Form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
                            <Modal.Header>
                                Import
                            </Modal.Header>
                            <Modal.Body>

                                <Form.Group controlId="formOption">
                                    <Form.Label>{t('select')}</Form.Label>
                                    <Form.Control as="select" value={selectedOption} onChange={handleOptionChange}>
                                        <option value="csv">CSV</option>
                                        {authState.user.googleConnected && <option value="google">Google</option>}
                                    </Form.Control>
                                </Form.Group>

                                {selectedOption === 'csv' && (
                                    <Form.Group controlId="formCsvFile">
                                        <Form.Label>{t('csv_file')}:</Form.Label>
                                        <Form.Control type="file" onChange={handleFileChange} />
                                    </Form.Group>
                                )}



                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => {setUserImportModal(false)}}>{t('close')}</Button>
                                <Button className="main_button" type="submit">
                                    Import
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>

                    { authState.user.currentRoles.includes('ROLE_TEACHER') && <StudiesUserForm showModal={showUserModal} closeModal={closeModal} addedUsers={users} studiesId={studiesId} />}

                </div>
            </div>
        </div>
    )
}

export default StudiesDetailsUser;
