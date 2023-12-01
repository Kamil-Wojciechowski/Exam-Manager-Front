import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from '../js/AxiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import toastr from 'toastr';
import AuthNavigate from '../js/AuthNavigate';

const StudiesDetailsUser = ({ authState }) => {
    const { studiesId } = useParams();
    const navigate = useNavigate();

    AuthNavigate(authState.isAuthenticated, true);

    const [staticData, setStatic] = useState({
        name: '',
        classroomId: '',
        classroomName: ''
    })

    const [classroomData, setClassrooms] = useState([])

    const [formData, setFormData] = useState({
        name: '',
        classroomId: '',
        classroomName: '',
        owner: false
    })

    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if(isNaN(+studiesId)) {
            navigate("/");
            return;
        }

        const getStudies = async () => {
            await axios.get("/studies/" + studiesId).then((res) => {
                setFormData(res.data.data);
                setStatic(res.data.data);
            });
        }

        const getClassrooms = async () => {
            await axios.get("/studies/classrooms").then((res) => {
                setClassrooms(res.data.data);
            });
        }

        getStudies();

        if (authState.user.googleConnected) {
            getClassrooms();
        }

    }, [])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleForm = () => {
        if (formData.owner) {
            setDisabled(!disabled);
            setFormData(staticData);
        }
    }

    const handleOptionChange = (event) => {
        const selectedClassroomId = event.target.value;
        const selectedClassroom = classroomData.find(item => item.id === selectedClassroomId);

        setFormData({
            ...formData,
            classroomId: selectedClassroomId,
            classroomName: selectedClassroom.name,
        });
    }

    const handleUpdate = async () => {
        axios.patch("/studies/" + studiesId, formData).then(res => {
            toastr.success("Item updated!");

            setStatic(formData);
            setDisabled(true);
        }).catch(error => {
            toastr.error(error.response.data.message);
        })
    }

    const handleDelete = async () => {
        await axios.delete("/studies/" + studiesId).then(res => {
            toastr.success("Item deleted");
            navigate("/");
        }).catch(error => {
            toastr.error(error.response.data.message);
        });
    }

    return (
        <div className='center-main centered-element'>
            <div className='centered-element'>
                {formData.owner && <Button type='button' onClick={() => { handleForm() }}>Edit</Button>}
                {formData.owner && <Button type='button' onClick={() => { handleDelete() }}>Delete</Button>}

                <Form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} >
                    <fieldset disabled={disabled}>
                        <Form.Group>
                            <Form.Label>
                                <p>Nazwa:</p>
                                {(disabled) ? <p>{staticData.name}</p> : <Form.Control input='text' name='name' value={formData.name} onChange={handleChange} />}
                            </Form.Label>
                            {
                                (staticData.classroomName && disabled) ?
                                    <>
                                        <p>Classroom:</p>
                                        <p>{staticData.classroomName}</p>
                                    </>
                                    :
                                    (authState.user.googleConnected && !disabled) ? <Form.Label>
                                        <p>Classroom:</p>
                                        <Form.Control as="select" value={formData.classroomId ? formData.classroomId : ''} onChange={handleOptionChange}>
                                            <option value="" disabled>Select an item</option>
                                            {
                                                classroomData.map(item => (
                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                                ))
                                            }
                                        </Form.Control>
                                    </Form.Label> : <></>

                            }

                        </Form.Group>
                    </fieldset>
                    {!disabled && <Button className="main_button" variant='primary' type="submit">Zaaktualizuj</Button>}
                </Form>


            </div>
        </div>
    )
}

export default StudiesDetailsUser;
