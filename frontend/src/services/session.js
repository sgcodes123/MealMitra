import { disconnectSocket } from "./socket";
export function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    disconnectSocket();
}