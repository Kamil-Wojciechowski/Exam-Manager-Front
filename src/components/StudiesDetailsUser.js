import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
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
        if (isNaN(+studiesId)) {
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
    const [showDeleteModal, setDeleteModal] = useState(false);

    const openDeleteModal = () => {
        setDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setDeleteModal(false);
    }


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


        </div>
    )
}

export default StudiesDetailsUser;
