import express from "express";
import http from "http";
import { initSocketIO } from "./config/socket";
// ...other imports

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocketIO(server);

// ...rest of your server setup code

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
