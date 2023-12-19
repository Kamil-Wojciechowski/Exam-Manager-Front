import React, { useEffect, useState } from "react";
import axios from "../js/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import useAuthNavigate from "../js/AuthNavigate";
import DatabaseForm from "./forms/DatabaseForm";
import { Button, Modal, Table } from "react-bootstrap";
import toastr from "toastr";
import debounce from "lodash.debounce";
import Pagination from "./general/Pagination";
import { FaCrown } from "react-icons/fa";
import { TiUserDelete } from "react-icons/ti";
import { CiEdit } from "react-icons/ci";


const DatabaseId = ({ authState }) => {

    const navigate = useNavigate();

    useAuthNavigate(authState.isAuthenticated, true, authState.user.currentRoles.includes('ROLE_TEACHER'), true);

    const { databaseId } = useParams();
    const [state, setState] = useState(0);

    const [databaseDetails, setDatabaseDetails] = useState({
        name: ""
    });

    const [ showEditModal, setShowEditModal ] = useState(false);
    const [ showDeleteModal, setShowDeleteModal ] = useState(false); 
    const [pageDetails, setPageDetails] = useState({
        page: 1,
        pages: 0
    });

    const closeModalUser = () => {
        setState(state + 1);
    }


    useEffect(() => {
        const getDatabase = async () => {
            await axios.get("/questions/metadata/" + databaseId).then((res) => {
                setDatabaseDetails(res.data.data);
            })
        };

        // const getDatabaseUsers = async () => {
            // await axios.get("/questions/metadata/" + databaseId + "/ownerships", {
            //     params: {
            //         "page": pageDetails.page - 1            
            //     }
            // })

                // const owner = res.data.data.some((element) => {
                //     return element.ownership === "OWNER" && authState.user.id === element.user.id;
                //   });

                //   setOwner(owner);
            // })
        // };

        // getDatabaseUsers();

        getDatabase();
    }, [state]);

    const changeState = () => {
        setState(state + 1);
    }

    const closeModal = () => {
        setShowEditModal(false);
    };

    const formatDate = (dateString) => {
        if (dateString) {
          const date = new Date(dateString);
          return date.toLocaleString();
        }
        return "N/A";
      };

    const handleDelete = async () => {
        await axios.delete("/questions/metadata/" + databaseId).then(res => {
            setShowDeleteModal(false);
            navigate("/admin/database");
        }).catch((error) => {
            toastr.error(error.response.data.message);
        })
    }


    return (
        <div className='center-main'>
            <div className='centered-element'>
                <Button onClick={() => {navigate("/admin/database/" + databaseId + "/questions")}}>Pytania</Button>
            <Button onClick={() => {setShowEditModal(true)}}>Edytuj</Button>
            <Button onClick={() => {setShowDeleteModal(true)}}>Usuń</Button>
                <p>Name:</p>
                <p>{databaseDetails.name}</p>

                <p>Craeted at:</p>
                <p>{formatDate(databaseDetails.createdAt)}</p>

                <p>Update at:</p>
                <p>{formatDate(databaseDetails.updatedAt)}</p>

            </div>

            <DatabaseForm showUpdateModal={showEditModal} closeModal={closeModal} databaseId={databaseId} itemData={databaseDetails} changeState={changeState}></DatabaseForm>
            <Modal show={showDeleteModal} onHide={() => {setShowDeleteModal(false);}}>
                <Modal.Header>
                    Database
                </Modal.Header>
                <Modal.Body>
                    Czy chcesz usunąć baze {databaseDetails.name}?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {handleDelete();}}>Usuń</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DatabaseId;