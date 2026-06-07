import axios from 'axios';

// Public axios instance — no auth token
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
