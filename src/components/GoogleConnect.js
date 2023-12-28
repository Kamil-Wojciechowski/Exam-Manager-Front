import React, { useEffect } from "react";
import useAuthNavigate from "../js/AuthNavigate";
import { PacmanLoader } from "react-spinners";
import axios from "../js/AxiosInstance";
import { useNavigate } from "react-router-dom";

const GoogleConnect = ({ authState }) => {
    const navigate = useNavigate();
    const process = true;

    useAuthNavigate(authState.isAuthenticated, true, authState.isTeacher, true);

    useEffect(() => {
        axios.get("/oauth/google", {
            headers: {
                "Access-Control-Allow-Headers": "*"
            }
        }).then(res => {
            const locationHeader = res.headers.get('Google-Url');
            if (locationHeader) {
                window.location.href = locationHeader;
            }
        }).catch(error => {
            navigate("/");
        })
    }, [])


    if (process) {
        return <div className='center-main'><PacmanLoader className='centered-element' color="#36d7b7" /></div>;
    }
}

export default GoogleConnect;