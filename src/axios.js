import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASEURL || 'http://localhost:4500/api'
});
// eslint-disable-next-line dot-notation
axiosInstance.defaults.headers.common['authorization'] = localStorage.getItem('posty_token');
export default axiosInstance;
