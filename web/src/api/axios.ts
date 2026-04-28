import Axios, { type AxiosResponse } from 'axios';

const axios = Axios.create({
  baseURL: 'http://localhost:8000',
  // baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

axios.interceptors.request.use(async req => {
  const storageVal = window.localStorage.getItem('token');
  let token = '';
  if (storageVal) {
    token = JSON.parse(storageVal);
  }
  req.headers.Authorization = `Bearer ${token}`;
  return req;
});

axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  error => {
    if (error.response?.status === 401) {
    }

    return Promise.reject({
      message: error.response?.data || 'Unknown error',
      status: error.response?.status || 500,
    });
  },
);

export default axios;
