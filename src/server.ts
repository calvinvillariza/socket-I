import express from "express";
import { WebSocketServer } from "ws";
import redisClient from "./redisClient";
import dotenv from "dotenv";
import { env } from "process";
import { GetRequest, Message } from "./types";

dotenv.config();

const app = express();
const port = env.API_PORT;

app.get("/", (_req, res) => {
    res.send("socket-I is running!");
});

const server = app.listen(port, () => {
    console.log(`socket-I is running at http://localhost:${port}`);
});


const wss = new WebSocketServer({
    server
});

wss.on('connection', (ws, req: GetRequest<{ token: string }>) => {
    const { token } = req.headers;

    console.log('Client wss connected');
    console.log('TODO:: authenticate', token);

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