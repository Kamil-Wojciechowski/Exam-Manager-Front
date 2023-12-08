import React, { useEffect } from "react";
import useAuthNavigate from "../js/AuthNavigate";
import axios from "../js/AxiosInstance";
import { useNavigate } from "react-router-dom";

const GoogleCallback = ({ authState }) => {
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(window.location.search);

    useAuthNavigate(authState.isAuthenticated, true, authState.isTeacher, true);

    useEffect(() => {
        const setUserOauth = async () => {
            const code = queryParams.get("code");
            if(code) {
                axios.post("/oauth/callback", {}, {
                    params: {
                        code: code
                    }
                }).then(res => {
                    window.location.href = "/";
                }).catch(err => {
                    navigate("/");
                })
            } else {
                navigate("/")
            }
        };

        setUserOauth();
        
    })

}

export default GoogleCallback;