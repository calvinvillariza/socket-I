import express from "express";
import dotenv from "dotenv";
import { env } from "process";
import { Server } from "http";
import { Response } from 'express';
import { loadMessage } from "./messageBasic/message";
import { auth, token } from "./helpers/auth";
import { GetRequest } from "./types";

dotenv.config();

const app = express();
const port = env.API_PORT;

app.get("/", (_req, res) => {
    res.send("socket-I is running!");
});

const server: Server = app.listen(port, () => {
    console.log(`socket-I is running at http://localhost:${port}`);
});

const router = express.Router();

router.get("/token", (_req, res) => {
    res.status(200);
    res.send(token);
});
router.get("/auth/check", auth, async (_req: GetRequest, res: Response): Promise<void> => {
    res.status(200);
    res.send('OK');
});

app.use("/api", router);

loadMessage(server);

console.log(`socket-I is running at ws://localhost:${port}`);