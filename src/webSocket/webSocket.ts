import { Server } from "http";
import { WebSocketServer } from "ws";

const wss = (server: Server) => {
    return new WebSocketServer({
        server
    });
};

export default wss;