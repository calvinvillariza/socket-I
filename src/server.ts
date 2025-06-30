import express from "express";
import { WebSocketServer } from "ws";
import redisClient from "./redisClient";
import { Message } from "./types/message";

const app = express();
const port = 3000;

app.get("/", (_req, res) => {
    res.send("socket-I is running!");
});

const server = app.listen(port, () => {
    console.log(`socket-I is running at http://localhost:${port}`);
});


const wss = new WebSocketServer({
    server
});

wss.on('connection', (ws) => {
    console.log('Client wss connected');

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

    ws.on('message', (data) => {
        const message: Message = JSON.parse(data.toString());

        message.timestamp = new Date().toISOString();

        const messageString = JSON.stringify(message);

        redisClient.rPush('message_history', messageString);
        redisClient.lTrim('message_history', -100, -1)

        wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(messageString);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client wss disconnected');
    });
});

console.log(`socket-I is running at ws://localhost:${port}`);