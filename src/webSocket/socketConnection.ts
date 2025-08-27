import { Server } from "http";
import wss from "./webSocket";
import { GetRequest } from "../types";
import { verifyToken } from "../helpers/auth";

export const socketConnection = (server: Server) => {
    const webSocket = wss(server);

    return webSocket.on('connection', (ws, req: GetRequest) => {
        const { auth } = req.headers;

        console.log('Client wss connected');

        if (!auth || verifyToken(auth as string) === null) {
            ws.close();
            return;
        }

        ws.on('close', () => {
            console.log('Client wss disconnected');
        });

        return ws;
    });
};