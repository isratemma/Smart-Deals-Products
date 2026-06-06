import axios from 'axios';

// Public axios instance — no auth token
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
