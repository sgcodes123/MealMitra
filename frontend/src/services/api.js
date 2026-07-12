import axios from "axios";
import { clearSession } from "./session";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});
api.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const wasAuthenticatedRequest = Boolean(error.config?.headers?.Authorization);
        if (error.response?.status === 401 && wasAuthenticatedRequest) {
            clearSession();
            if (!window.location.pathname.startsWith("/login")) {
                window.dispatchEvent(new Event("auth:sessionExpired"));
            }
        }
        return Promise.reject(error);
    }
);

export default api;