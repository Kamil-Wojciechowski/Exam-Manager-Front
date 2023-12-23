import React, { useEffect, useState } from "react";
import axios from "../../js/AxiosInstance";
import { Modal } from "react-bootstrap";

const DatabaseUserForm = (showAddModal, showUpdateModal, closeModal, databaseId ) => {
    const [ formData, setFormData ] = useState({
        user: {
            id: null
        },
        ownership: null
    })

    const [ ownerships, setOwnerships ] = useState([]);
    const [ users, setUsers ] = useState([]);

    const [pageDetails, setPageDetails] = useState({
        page: 1,
        pages: 0
    });

    
    const [filters, setFilters] = useState({
        role: "TEACHER",
        firstname: null,
        lastname: null,
        email: null
    });

    useEffect(() => {
        const getUsers = async () => {
            await axios.get("/users", {
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
        };

        const getOwnerships = async () => {

        };

        getUsers();
        getOwnerships();
    }, [])

    return (
        <Modal show={showAddModal} onHide={closeModal}>
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
                                <Button>
                                   test
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

export default DatabaseUserForm;