import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "../../js/AxiosInstance";
import toastr from "toastr";

const DatabaseForm = ({ showAddModal, showUpdateModal, closeModal, databaseId, itemData, changeState }) => {
    const [formData, setFormData] = useState({
        name: ""
    })

    useEffect(() => {
        if (itemData && itemData.name) {
            setFormData({
                name: itemData.name
            });
        }
    }, [itemData]);
    

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleForm = async () => {
        if(showAddModal) {
            await axios.post("/questions/metadata", formData).then(res => {
                changeState();
                closeModal();
                toastr.success("Success!");
            }).catch(error => {
                toastr.error(error.response.data.message);
            });
        } else if(showUpdateModal) {
            await axios.put("/questions/metadata/" + databaseId, formData).then(res => {
                changeState();
                closeModal();
                toastr.success("Success!");
            }).catch(error => {
                toastr.error(error.response.data.message);
            })
        }
    };

    return (
        <Modal show={showAddModal || showUpdateModal} onHide={closeModal}>
            <Form onSubmit={(e) => {e.preventDefault(); handleForm();}}>
                <Modal.Header>
                    Database
                </Modal.Header>
                <Modal.Body>
                    <Form.Label>
                        <p>Nazwa:</p>
                        <Form.Control input="text" name="name" value={formData.name} onChange={handleChange}></Form.Control>
                    </Form.Label>
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit">
                        {showAddModal && "Dodaj"}
                        {showUpdateModal && "Zaaktualizuj"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>);
};

export default DatabaseForm;