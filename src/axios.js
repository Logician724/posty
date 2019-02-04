import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASEURL || 'http://localhost:4500/api'
});

export default axiosInstance;
