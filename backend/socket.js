const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Order = require("./models/Order");

let io;



function initSocket(httpServer, allowedOrigins) {
    io = new Server(httpServer, {
        cors: { origin: allowedOrigins, credentials: true },
    });

    io.on("connection", (socket) => {
        const token = socket.handshake.auth?.token;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.userId = decoded.id;
            } catch {
            }
        }

        socket.on("joinOrder", async (orderId) => {
            if (typeof orderId !== "string" || !socket.userId) return;
            try {
                // Only the order's owner may subscribe to its updates.
                const order = await Order.findById(orderId).select("userId");
                if (order && order.userId.toString() === socket.userId) {
                    socket.join(`order:${orderId}`);
                }
            } catch {
            }
        });
    });

    return io;
}
function emitOrderUpdate(orderId, payload) {
    if (!io) return;
    io.to(`order:${orderId}`).emit("orderUpdated", payload);
}

module.exports = { initSocket, emitOrderUpdate };