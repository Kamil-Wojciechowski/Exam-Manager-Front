import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "../../js/AxiosInstance";
import toastr from "toastr";
import { useTranslation } from "react-i18next";

const DatabaseForm = ({ showAddModal, showUpdateModal, closeModal, databaseId, itemData, changeState }) => {
    const { t } = useTranslation();

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
        if (showAddModal) {
            await axios.post("/questions/metadata", formData).then(res => {
                changeState();
                closeModal();
                toastr.success(t('success'));
            }).catch(error => {
                toastr.error(error.response.data.message);
            });
        } else if (showUpdateModal) {
            await axios.put("/questions/metadata/" + databaseId, formData).then(res => {
                changeState();
                closeModal();
                toastr.success(t('success'));
            }).catch(error => {
                toastr.error(error.response.data.message);
            })
        }
    };

    return (
        <Modal show={showAddModal || showUpdateModal} onHide={closeModal}>
            <Form onSubmit={(e) => { e.preventDefault(); handleForm(); }}>
                <Modal.Header>
                    {t('database')}
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>
                            <p>{t('name')}:</p>
                        </Form.Label>
                        <Form.Control input="text" name="name" value={formData.name} onChange={handleChange}></Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { closeModal(); }}>{t('close')}</Button>
                    <Button className="main_button" type="submit">
                        {showAddModal && t('add')}
                        {showUpdateModal && t('update')}
                    </Button>

                </Modal.Footer>
            </Form>
        </Modal>);
};

export default DatabaseForm;