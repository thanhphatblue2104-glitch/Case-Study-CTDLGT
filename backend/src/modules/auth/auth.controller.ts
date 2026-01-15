import { Request, Response } from "express";
import * as authService from "./auth.service";

export const register = async (req: Request, res: Response) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    console.log("Auth Controller Login Hit", req.body);
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};
