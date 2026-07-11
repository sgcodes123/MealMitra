import { io } from "socket.io-client";


const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SOCKET_URL = apiUrl.replace(/\/api\/?$/, "") || "http://localhost:5000";

let socket = null;


export function getSocket() {
    if (!socket) {
        socket = io(SOCKET_URL, {
            autoConnect: false,
            auth: { token: localStorage.getItem("token") },
        });
    }
    return socket;
}