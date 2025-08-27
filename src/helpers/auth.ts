import { env } from "process";
import jwt from "jsonwebtoken";
import { GetRequest } from "../types";
import { Response, NextFunction } from "express";

const secret = env?.API_SECRET ?? "your-default-secret";

const token = jwt.sign(
    {
        userId: "user123",
        role: "admin"
    },
    secret,
    {
        expiresIn: "2minutes",
    }
);

const auth = async (req: GetRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('auth')?.replace('Bearer ', '')
        if (!token) {
          throw new Error('Authentication failed. Token missing.')
        }

        const decoded: { userId: string } | null = verifyToken(token);

        if (decoded === null) {
          throw new Error('Authentication failed.')
        }

        req.token = token
        next()
      } catch (error) {
        res.status(401).send({ error: 'Authentication failed.' })
      }
};

const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded: { userId: string } = jwt.verify(token, secret) as { userId: string };

    if (!decoded.userId) return null;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export {
    token,
    auth,
    verifyToken
}