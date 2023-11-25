
import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../js/AxiosInstance';
import { useTranslation } from 'react-i18next';
import toastr from 'toastr';

const Recovery = ({ authState }) => {
    const navigate = useNavigate();
    const { recoveryToken } = useParams();
    const { t } = useTranslation();


    useEffect(() => {
        if (authState.isAuthenticated) {
            navigate("/");
        }

        checkToken();

        async function checkToken() {
            try {
                await axios.get("/auth/recovery", {
                    params: {
                        token: recoveryToken
                    }
                })

            } catch (error) {
                navigate("/login")
            }
        }


    }, [authState, navigate, recoveryToken])


    const [formData, setFormData] = useState({
        password: '',
        confirmedPassword: '',
    });

    const [errors, setErrors] = useState([]);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const passwordValidationRules = [
        {
            description: "pwd_match",
            validator: (formData) => formData.password === formData.confirmedPassword,
        },
        {
            description: "pwd_between",
            validator: (formData) => formData.password.length >= 8 && formData.password.length <= 30,
        },
        {
            description: "pwd_upper",
            validator: (formData) => /[A-Z]/.test(formData.password),
        },
        {
            description: "pwd_digit",
            validator: (formData) => /\d/.test(formData.password),
        },
        {
            description: "pwd_special",
            validator: (formData) => /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
        },
        {
            description: "pwd_qwerty",
            validator: (formData) => !/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(formData.password),
        },
        {
            description: "pwd_whitespace",
            validator: (formData) => !/\s/.test(formData.password),
        },
    ];

    const validatePassword = () => {
        const errors = passwordValidationRules
            .filter(rule => !rule.validator(formData))
            .map(rule => rule.description);

        return errors && errors.length > 0 ? errors : null;


    };

    const handleRecovery = async (e) => {
        const pwdErrors = validatePassword();

        if (pwdErrors) {
            setErrors(pwdErrors);
        } else {
            try {
                await axios.post("/auth/recovered", {
                    password: formData.password,
                    confirmedPassword: formData.confirmedPassword
                }, {
                    params: {
                        token: recoveryToken
                    },
                })

                toastr.success(t('pwd_changed'))

                navigate("/login")
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    const errors = error.response.data.errors.map(item => item.defaultMessage)

                    setErrors(errors);
                }
            }
        }

    }



    return (
        <div id="recovery_token">
            <div className="centered-element">
                <div id="recovery_token-border">
                    <h2>{t('recovery')}</h2>
                    <div style={{ color: 'red' }}>
                        {errors.length > 0 && (
                            <ul>
                                {errors.map((error, index) => (
                                    <li key={index}>{t(error)}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <Form onSubmit={(e) => { e.preventDefault(); handleRecovery(); }}>
                        <Form.Group>
                            <Form.Label>
                                {t('password')}:
                                <Form.Control type='password' name='password' value={formData.password} onChange={handleChange} />
                            </Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                {t('passwordConfirm')}:
                                <Form.Control type='password' name='confirmedPassword' value={formData.confirmedPassword} onChange={handleChange} />
                            </Form.Label>
                        </Form.Group>
                        <div>
                            <Button className='main_button' variant='primary' type="submit">{t('send')}</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Recovery;