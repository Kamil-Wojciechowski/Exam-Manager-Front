import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../../js/AxiosInstance';
import toastr from 'toastr';

const StudiesForm = ({ authState, studiesData, studiesId, isCreate, showModal, closeModal }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        classroomId: '',
        classroomName: '',
        owner: false
    });

    const [classroomData, setClassrooms] = useState([])


    useEffect(() => {
        const getClassrooms = async () => {
            await axios.get("/studies/classrooms").then((res) => {
                setClassrooms(res.data.data);
            });
        }

        if (!isCreate) {
            setFormData(studiesData);
        }

        if (authState.user.googleConnected) {
            getClassrooms();
        }

    }, [isCreate, studiesData, authState.user.googleConnected]);

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
        if(isCreate) {
            axios.post("/studies", formData).then(res => {
                toastr.success("Item updated!");
                window.location.reload();
                closeModal(); // Close the modal after successful update
            }).catch(error => {
                toastr.error(error.response.data.message);
            });
        } else {
            axios.patch("/studies/" + studiesId, formData).then(res => {
                toastr.success("Item updated!");
                window.location.reload();
                closeModal(); // Close the modal after successful update
            }).catch(error => {
                toastr.error(error.response.data.message);
            });
        }
    }

    return (
        <Modal show={showModal} onHide={closeModal}>
            <Form onSubmit={(e) => { e.preventDefault(); handleForm(); }} >
                <Form.Group>
                    <Form.Label>
                        <p>Nazwa:</p>
                        <Form.Control input='text' name='name' value={formData.name} onChange={handleChange} />
                    </Form.Label>
                    {(authState.user.googleConnected && classroomData) && (
                        <Form.Label>
                            <p>Classroom:</p>
                            <Form.Control as="select" value={formData.classroomId ? formData.classroomId : ''} onChange={handleOptionChange}>
                                <option value="" disabled>Select an item</option>
                                {
                                    classroomData.map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                }
                            </Form.Control>
                        </Form.Label>
                    )}
                </Form.Group>
                <Modal.Footer>
                    {(isCreate) ?
                        <Button className="main_button" variant='primary' type="submit">Dodaj</Button>
                        :
                        <Button className="main_button" variant='primary' type="submit">Zaaktualizuj</Button>
                    }
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default StudiesForm;
