import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import axios from '../../js/AxiosInstance';
import Pagination from '../general/Pagination';
import debounce from 'lodash.debounce';
import toastr from 'toastr';


const StudiesUserForm = ({ showModal, closeModal, addedUsers, studiesId }) => {
    const [pageDetails, setPageDetails] = useState({
        page: 1,
        pages: 0
    });

    const [filters, setFilters] = useState({
        role: "STUDENT",
        firstname: null,
        lastname: null,
        email: null
    });

    const [users, setUsers] = useState([]);

    const [usersToAdd, setUsersToAdd] = useState([]);

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
            console.log(res.data);
        });
    }

    useEffect(() => {
        getUsers();
    }, [pageDetails.page])

    useEffect(() => {
        // Add logic to handle changes in usersToAdd
        console.log("usersToAdd changed:", usersToAdd);
    }, [usersToAdd]);

    const handlePageChange = debounce((newPage) => {
        setPageDetails({
            ...pageDetails,
            page: newPage
        });
    }, 100);

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const searchItems = () => {
        getUsers();
    }

    const handleUsers = (user) => {
        const userToAddIndex = usersToAdd.findIndex((item) => item.id === user.id);
        const userInAddedIndex = addedUsers.findIndex((item) => item.user.id === user.id);

        if (userToAddIndex === -1 && userInAddedIndex === -1) {
            // User is not added and not already in addedUsers, add the user
            setUsersToAdd([...usersToAdd, user]);
        } else {
            // User is added, remove the user
            const updatedUsers = [...usersToAdd];
            updatedUsers.splice(userToAddIndex, 1);
            setUsersToAdd(updatedUsers);
        }
    };

    const addUsersToStudies = async () => {
        if(usersToAdd.length === 0) {
            toastr.warning("No users added")
        } else {
            await usersToAdd.forEach(item => {
                axios.post("/studies/" + studiesId + "/users", {
                    "user": {
                        "id": item.id
                    }
                })
            });
    
            toastr.success("Items processed");
            window.location.reload();
        }
    }

    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header>
                Dodaj użytkownika
            </Modal.Header>
            <Modal.Body>
                <Table striped>
                    <thead>
                        <tr>
                            <th>Choose</th>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key="search">
                            <td><Button onClick={() => { searchItems(); }}>Search</Button></td>
                            <td>
                                <Form.Control input='text' name="firstname" value={filters.firstname} onChange={handleChange} />
                            </td>
                            <td>
                                <Form.Control input='text' name="lastname" value={filters.lastname} onChange={handleChange} />
                            </td>
                            <td>
                                <Form.Control input='text' name="email" value={filters.email} onChange={handleChange} />
                            </td>
                        </tr>

                        {users.map((item, index) => (
                            <tr key={item.id}>
                                <td>
                                    <Button
                                        onClick={() => {
                                            handleUsers(item);
                                        }}
                                        variant={
                                            usersToAdd.some((addedUser) => addedUser.id === item.id) ||
                                                addedUsers.some((addedUser) => addedUser.user.id === item.id)
                                                ? "danger"
                                                : "primary"
                                        }
                                        disabled={
                                            addedUsers.some((addedUser) => addedUser.user.id === item.id)
                                        }
                                    >
                                        {addedUsers.some((addedUser) => addedUser.user.id === item.id)
                                            ? "Already Added"
                                            : usersToAdd.some((addedUser) => addedUser.id === item.id)
                                                ? "Remove"
                                                : "Add"}
                                    </Button>

                                </td>
                                <td>
                                    {item.firstname}
                                </td>
                                <td>
                                    {item.lastname}
                                </td>
                                <td>
                                    {item.email}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination total={pageDetails.pages} currentPage={pageDetails.page} onPageChange={handlePageChange} />

            </Modal.Body>
            <Modal.Footer>
                <Button className="main_button" variant='primary' onClick={() => {addUsersToStudies()}}>Dodaj</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default StudiesUserForm;
