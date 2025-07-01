import { Server } from "http";
import wss from "./webSocket";
import { GetRequest } from "../types";

export const socketConnection = (server: Server) => {
    const webSocket = wss(server);

    return webSocket.on('connection', (ws, req: GetRequest<{ token: string }>) => {
        const { token } = req.headers;

        console.log('Client wss connected');
        console.log('TODO:: authenticate', token);

        if (!token) {
            ws.close();
            return;
        }

        ws.on('close', () => {
            console.log('Client wss disconnected');
        });

        return ws;
    });
};