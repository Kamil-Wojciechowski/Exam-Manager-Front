import { useEffect, useState } from "react";
import useAuthNavigate from "../js/AuthNavigate";
import { Button, Form, Modal, Table } from "react-bootstrap";
import axios from "../js/AxiosInstance";
import debounce from "lodash.debounce";
import Pagination from "./general/Pagination";
import { IoTrashBin } from "react-icons/io5";
import { FaCheck, FaTrashRestoreAlt } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import { IoIosSwap } from "react-icons/io";
import toastr from 'toastr';
import { useTranslation } from "react-i18next";



const Users = ({ authState }) => {

    useAuthNavigate(authState.isAuthenticated, true, authState.isTeacher, true);

    const { t } = useTranslation(); 
    const [state, setState] = useState(1);
    const [groups, setGroups] = useState([]);
    const [addModal, setAddModal] = useState(false);
    const [admin, setAdmin] = useState(false);

    const [filters, setFilters] = useState({
        role: "STUDENT",
        firstname: null,
        lastname: null,
        email: null
    });
    const [pageDetails, setPageDetails] = useState({
        page: 1,
        pages: 0
    });

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: ""
    });

    const clearForm = () => {
        setFormData({
            firstname: "",
            lastname: "",
            email: ""
        });
        setAdmin(false);
    }

    const [users, setUsers] = useState([]);
    useEffect(() => {
        const getUsers = async () => {
            axios.get("/users", {
                params: {
                    role: filters.role,
                    firstname: filters.firstname,
                    lastname: filters.lastname,
                    email: filters.email,
                    page: pageDetails.page - 1
                }
            }).then((res) => {
                setUsers(res.data.data);
                setPageDetails({
                    page: res.data.page + 1,
                    pages: res.data.pages
                });
            });
        }

        const getGroups = async () => {
            axios.get("/users/groups").then(res => {
                setGroups(res.data.data);
            })
        }

        getUsers();
        getGroups();

    }, [pageDetails.page, state])


    const searchItems = () => {
        setState(state + 1);
    }

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };


    const handlePageChange = debounce((newPage) => {
        setPageDetails({
            ...pageDetails,
            page: newPage
        });
    }, 100);

    const handleRoleChange = async (userId) => {
        await axios.patch(`/users/${userId}`).then(res => {
            toastr.success(t('success'));
            setState(state + 1);
        }).catch(error => {
            toastr.error(error.response.data.message);
        });
    }

    const handleDelete = async (userId) => {
        await axios.delete(`/users/${userId}`).then(res => {
            toastr.success(t('success'));
            setState(state + 1);
        }).catch(error => {
            toastr.error(error.response.data.message);
        });
    }

    const handleAddUser = async () => {
        await axios.post(`/users`, formData, {
            params: {
                teacher: admin
            }
        }).then(res => {
            clearForm();
            setAddModal(false);
            toastr.success(t('success'));
            setState(state + 1);
        }).catch(error => {
            toastr.error(error.response.data.message);
        });
    }

    const handleChangeUser = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    return (
        <div className='center-main centered-element'>
            <div className='centered-element'>
                <Button onClick={() => { setAddModal(true) }}>{t('add')}</Button>
                <Table striped>
                    <thead>
                        <tr>
                            <th>{t('firstname')}</th>
                            <th>{t('lastname')}</th>
                            <th>Email</th>
                            <th>{t('permission')}</th>
                            <th>{t('blocked')}</th>
                            <th>{t('options')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key="search">

                            <td>
                                <Form.Control input='text' name="firstname" value={filters.firstname} onChange={handleChange} />
                            </td>
                            <td>
                                <Form.Control input='text' name="lastname" value={filters.lastname} onChange={handleChange} />
                            </td>
                            <td>
                                <Form.Control input='text' name="email" value={filters.email} onChange={handleChange} />
                            </td>
                            <td>
                                <select value={filters.role} name="role" onChange={handleChange}>
                                    <option value="" disabled>{t('select')}</option>
                                    {groups.map(role => (
                                        <option key={role.key} value={role.key.split('_')[1]}>{t(role.key)}</option>
                                    ))}
                                </select>
                            </td>
                            <td>

                            </td>
                            <td>
                                <Button onClick={() => { searchItems(); }}>{t('search')}</Button>
                            </td>
                        </tr>

                        {users.map((item, index) => (

                            <tr key={item.id}>
                                <td>
                                    {item.firstname}
                                </td>
                                <td>
                                    {item.lastname}
                                </td>
                                <td>
                                    {item.email}
                                </td>
                                <td>
                                    {t(item.currentRoles.join(", "))}
                                </td>
                                <td>
                                    {item.locked ? <FaCheck /> : <HiXMark />}
                                </td>
                                <td>
                                    <IoIosSwap onClick={() => { handleRoleChange(item.id) }} />
                                    {item.locked ? <FaTrashRestoreAlt onClick={() => { handleDelete(item.id) }} /> : <IoTrashBin onClick={() => { handleDelete(item.id) }} />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination total={pageDetails.pages} currentPage={pageDetails.page} onPageChange={handlePageChange} />

            </div>
            <Modal show={addModal} onHide={() => { setAddModal(false); clearForm(); }}>
                <Form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }} onChange={handleChangeUser}>
                    <Modal.Header>
                        {t('user')}
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>
                                {t('firstname')}:
                                <Form.Control type='text' name='firstname' value={formData.firstname} />
                            </Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                {t('lastname')}:
                                <Form.Control type='text' name='lastname' value={formData.lastname} />
                            </Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                Email:
                                <Form.Control type='email' name='email' value={formData.email} />
                            </Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                Admin?:
                                <Form.Check
                                    type='checkbox'
                                    name='isTeacher'
                                    checked={admin}
                                    onChange={(e) => { setAdmin(e.target.checked) }}
                                />
                            </Form.Label>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { setAddModal(false); clearForm(); }}>{t('close')}</Button>
                        <Button type="submit">{t('add')}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    )
}

export default Users;