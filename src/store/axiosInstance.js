import Appapis from "./apiEndpoints"

import axios from "axios"


const axiosInstance = axios.create({
    baseURL: Appapis.Basurl, // Ensure this is a valid URL

});
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("userToken");
        const userId = localStorage.getItem("userId");


        // config.headers["userId"] = userId || "null"
        config.headers["authorization"] = `Bearer ${token || ""}` || "null"
        config.headers["Content-Type"] = "application/json";
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default axiosInstance