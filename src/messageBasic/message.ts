import { Server } from "http";
import { socketConnection } from "../webSocket/socketConnection";
import redisClient from "../redisClient";
import { Message } from "../types";

export const loadMessage = (server: Server) => {
    const connection = socketConnection(server);

    connection
        .on('connection', (ws, _req) => {
            redisClient.lRange('message_history', 0, -1)
                .then(
                    (messages) => {
                        messages.forEach((message) => {
                            ws.send(message);
                        });
                    },
                    (error) => {
                        console.error('Error fetching messages from Redis:', error);
                        return;
                    }
                );
        })
        .on('message', (data) => {
            const message: Message = JSON.parse(data.toString());

            message.timestamp = new Date().toISOString();

            const messageString = JSON.stringify(message);

            redisClient.rPush('message_history', messageString);
            redisClient.lTrim('message_history', -100, -1)

            connection.clients.forEach((client) => {
                if (client.readyState === client.OPEN) {
                    client.send(messageString);
                }
            });
        });
};