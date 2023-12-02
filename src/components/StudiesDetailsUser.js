import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from '../js/AxiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import toastr from 'toastr';
import AuthNavigate from '../js/AuthNavigate';
import StudiesForm from './forms/StudiesForm';

const StudiesDetailsUser = ({ authState }) => {
    const { studiesId } = useParams();
    const navigate = useNavigate();

    AuthNavigate(authState.isAuthenticated, true);

    const [formData, setFormData] = useState({
        name: '',
        classroomId: '',
        classroomName: '',
        owner: false
    })

    useEffect(() => {
        if(isNaN(+studiesId)) {
            navigate("/");
            return;
        }

        const getStudies = async () => {
            await axios.get("/studies/" + studiesId).then((res) => {
                setFormData(res.data.data);
            });
        }

        getStudies();
    }, [])

    const handleDelete = async () => {
        await axios.delete("/studies/" + studiesId).then(res => {
            toastr.success("Item deleted");
            navigate("/");
        }).catch(error => {
            toastr.error(error.response.data.message);
        });
    }

    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className='center-main centered-element'>
            <div className='centered-element'>
                {formData.owner && <Button type='button' onClick={() => { openModal() }}>Edit</Button>}
                {formData.owner && <Button type='button' onClick={() => { handleDelete() }}>Delete</Button>}

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
        </div>
    )
}

export default StudiesDetailsUser;
