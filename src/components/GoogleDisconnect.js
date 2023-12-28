import React, { useEffect } from "react";
import useAuthNavigate from "../js/AuthNavigate";
import { PacmanLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import axios from "../js/AxiosInstance";

const GoogleDisconnect = ({ authState }) => {
    const navigate = useNavigate();
    const process = true;    

    useAuthNavigate(authState.isAuthenticated, true, authState.isTeacher, true);

    useEffect(() => {
        axios.post("/oauth/disconnectLocalAccount").then(res => {
            window.location.href = '/';
        }).catch(error => {
            navigate("/")
        })
    }, []);

    if(process) {
        return <div className='center-main'><PacmanLoader className='centered-element' color="#36d7b7" /></div>;
    }
}

export default GoogleDisconnect;