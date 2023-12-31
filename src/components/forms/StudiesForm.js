import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from '../../js/AxiosInstance';
import toastr from 'toastr';
import { useTranslation } from 'react-i18next';

const StudiesForm = ({ authState, studiesData, studiesId, isCreate, showModal, closeModal, changeState }) => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: '',
        classroomId: '',
        classroomName: '',
        owner: false
    });

    const [classroomData, setClassrooms] = useState([])

    useEffect(() => {
        const getClassrooms = async () => {
            if(authState.user.googleConnected) {
                await axios.get("/studies/classrooms").then((res) => {
                    setClassrooms(res.data.data);
                });
            }
        }

        if (!isCreate) {
            setFormData(studiesData);
        }
        
        if ((isCreate | formData.owner)) {
            getClassrooms();
        }

    }, [showModal, isCreate, studiesData, authState.user.googleConnected]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleOptionChange = (event) => {
        const selectedClassroomId = event.target.value;
        const selectedClassroom = classroomData.find(item => item.id === selectedClassroomId);

        setFormData((prevFormData) => ({
            ...prevFormData,
            classroomId: selectedClassroomId,
            classroomName: selectedClassroom.name,
        }));
    }


    const handleForm = async () => {
        if (isCreate) {
            axios.post("/studies", formData).then(res => {
                toastr.success(t('success'));
                window.location.reload();
                closeModal();
            }).catch(error => {
                toastr.error(error.response.data.message);
            });
        } else {
            axios.patch("/studies/" + studiesId, formData).then(res => {
                toastr.success(t('success'));
                window.location.reload();
                closeModal();
            }).catch(error => {
                toastr.error(error.response.data.message);
            });
        }
    }

    return (
        <Modal show={showModal} onHide={closeModal}>
            <Form onSubmit={(e) => { e.preventDefault(); handleForm(); }} >
                <Modal.Header>
                    {t('group')}
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>
                            <p>{t('name')}:</p>
                        </Form.Label>
                        <Form.Control input='text' name='name' value={formData.name} onChange={handleChange} />
                    </Form.Group>
                    <br/>
                    {(authState.user.googleConnected && classroomData) && (
                        <Form.Group>
                            <Form.Label>
                                <p>Classroom:</p>
                            </Form.Label>
                            <Form.Control as="select" value={formData.classroomId ? formData.classroomId : ''} onChange={handleOptionChange}>
                                <option value="" disabled>{t('select')}</option>
                                {
                                    classroomData.map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                }
                            </Form.Control>
                        </Form.Group>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { closeModal(); }}>{t('close')}</Button>
                    {(isCreate) ?
                        <Button className="main_button" variant='primary' type="submit">{t('add')}</Button>
                        :
                        <Button className="main_button" variant='primary' type="submit">{t('update')}</Button>
                    }
                </Modal.Footer>
            </Form>
        </Modal >
    );
}

export default StudiesForm;
