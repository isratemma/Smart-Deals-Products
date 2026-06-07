import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const instance = axios.create({
  baseURL: 'http://localhost:3000',
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { signOutUser } = useContext(AuthContext);

  // Request interceptor — attach token
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor — handle 401 & 403
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        console.warn(`Auth error ${status} — logging out`);
        signOutUser()
          .then(() => {
            localStorage.removeItem('token');
            navigate('/login');
          })
          .catch(() => {
            localStorage.removeItem('token');
            navigate('/login');
          });
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxiosSecure;
