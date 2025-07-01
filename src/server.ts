import express from "express";
import dotenv from "dotenv";
import { env } from "process";
import { Server } from "http";
import { loadMessage } from "./messageBasic/message";

dotenv.config();

const app = express();
const port = env.API_PORT;

app.get("/", (_req, res) => {
    res.send("socket-I is running!");
});

const server: Server = app.listen(port, () => {
    console.log(`socket-I is running at http://localhost:${port}`);
});

loadMessage(server);

console.log(`socket-I is running at ws://localhost:${port}`);