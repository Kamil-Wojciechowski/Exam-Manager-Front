import React, { useEffect, useState } from "react";
import useAuthNavigate from "../js/AuthNavigate";
import axios from "../js/AxiosInstance";
import debounce from "lodash.debounce";
import Pagination from "./general/Pagination";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import DatabaseForm from "./forms/DatabaseForm";

const Database = ({ authState }) => {
    const navigate = useNavigate();
    useAuthNavigate(authState.isAuthenticated, true, authState.user.currentRoles.includes('ROLE_TEACHER'), true);

    const [addModal, setAddModal] = useState(false);

    const [databases, setDatabases] = useState([]);
    const [state, setState] = useState(0);
    const [pageDetails, setPageDetails] = useState({
        page: 1,
        pages: 0
    });


    const getDatabases = async () => {
        await axios.get("/questions/metadata", {
            params: {
                "page": pageDetails.page - 1            
            }
        }).then(res => {
            setDatabases(res.data.data);
            setPageDetails({
                page: res.data.page + 1,
                pages: res.data.pages
            });
        });
    }

    const handlePageChange = debounce((newPage) => {
        setPageDetails({
            ...pageDetails,
            page: newPage
        });
    }, 100);

    useEffect(() => {
        getDatabases();
    }, [state, pageDetails.page]);

    const closeModal = () => {
        setAddModal(false);
    }

    const changeState = () => {
        setState(state + 1);
    }


    return (
        <div className='content'>
            <Button onClick={() => { setAddModal(true); }} >Add</Button>
            <div className='dashboard'>
                {databases.map((item, index) => (
                    <div className="dashboard_item" key={item.id} onClick={() => { navigate("/admin/database/" + item.id) }}>
                        <h2>{item.name}</h2>
                    </div>

                ))}
            </div>
            <Pagination total={pageDetails.pages} currentPage={pageDetails.page} onPageChange={handlePageChange} />

            <DatabaseForm showAddModal={addModal} closeModal={closeModal} changeState={changeState}></DatabaseForm>
        </div>
    )
}

export default Database;