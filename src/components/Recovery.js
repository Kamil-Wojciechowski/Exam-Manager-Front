import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toastr from 'toastr';
import axios from '../js/AxiosInstance';
import AuthNavigate from '../js/AuthNavigate';

const Recovery = ({ authState }) => {
    const navigate = useNavigate();

    AuthNavigate(authState.isAuthenticated, false);

    const [formData, setFormData] = useState({
        email: '',
    });

    const [errors, setErrors] = useState({
        email: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Niepoprawna wartość.';
            isValid = false;
        }

        setErrors(newErrors);

        return isValid;
    }

    const handleRecovery = async () => {
        if (validateForm()) {
            try {
                await axios.post("/auth/recovery/" + formData.email);
            } catch (error) { }

            toastr.success("Email został wysłany, na podany adres email.")
            navigate("/login");
        }

    };


    // Render the login form if not authenticated
    return (
        <div id="recovery">
            <div className="centered-element">
                <div id="recovery-border">
                    <h2>Przypomnij hasło</h2>
                    <Form onSubmit={(e) => { e.preventDefault(); handleRecovery(); }}>
                        <Form.Group>
                            <Form.Label>
                                Email:
                                <Form.Control type='email' name='email' value={formData.email} onChange={handleChange} />
                            </Form.Label>
                            <div style={{ color: 'red' }}>{errors.email}</div>
                        </Form.Group>
                        <div>
                            <Button className="main_button" variant='primary' type="submit">Wyślij email</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};


export default Recovery;
