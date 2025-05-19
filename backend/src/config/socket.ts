import { Server as SocketIOServer } from "socket.io";
import { Server } from "http";

let io: SocketIOServer;

export const initSocketIO = (httpServer: Server) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: "*", // Match this with your frontend domain in production
            methods: ["GET", "POST"],
            credentials: true,
        },
        transports: ["websocket", "polling"],
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    console.log("Socket.IO initialized");
    return io;
};

export const getSocketIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized");
    }
    return io;
};
