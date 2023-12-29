import React, { useEffect, useState } from "react";
import axios from "../js/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import useAuthNavigate from "../js/AuthNavigate";
import DatabaseForm from "./forms/DatabaseForm";
import { Button, Modal } from "react-bootstrap";
import toastr from "toastr";
import { useTranslation } from "react-i18next";


const DatabaseId = ({ authState }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    useAuthNavigate(authState.isAuthenticated, true, authState.user.currentRoles.includes('ROLE_TEACHER'), true);

    const { databaseId } = useParams();
    const [state, setState] = useState(0);

    const [databaseDetails, setDatabaseDetails] = useState({
        name: ""
    });

    const [ showEditModal, setShowEditModal ] = useState(false);
    const [ showDeleteModal, setShowDeleteModal ] = useState(false); 
    // const [pageDetails, setPageDetails] = useState({
    //     page: 1,
    //     pages: 0
    // });

    // const closeModalUser = () => {
    //     setState(state + 1);
    // }


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
                <h2>{t('databases')}</h2>
                <Button className="main_button" onClick={() => {navigate("/admin/database/" + databaseId + "/questions")}}>{t('questions')}</Button>
                <Button className="main_button" onClick={() => {setShowEditModal(true)}}>{t('edit')}</Button>
                <Button className="main_button" onClick={() => {setShowDeleteModal(true)}}>{t('remove')}</Button>
                <p>{t('name')}: {databaseDetails.name}</p>

                <p>{t('created_at')}: {formatDate(databaseDetails.createdAt)}</p>

                <p>{t('update_at')}: {formatDate(databaseDetails.updatedAt)}</p>

            </div>

            <DatabaseForm showUpdateModal={showEditModal} closeModal={closeModal} databaseId={databaseId} itemData={databaseDetails} changeState={changeState}></DatabaseForm>
            <Modal show={showDeleteModal} onHide={() => {setShowDeleteModal(false);}}>
                <Modal.Header>
                    {t('database')}
                </Modal.Header>
                <Modal.Body>
                    {t('do_you_want_delete')} {databaseDetails.name}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowDeleteModal(false); }}>{t('close')}</Button>

                    <Button className="main_button" onClick={() => {handleDelete();}}>{t('remove')}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DatabaseId;