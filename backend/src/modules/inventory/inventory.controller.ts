import { Request, Response } from "express";
import * as inventoryService from "./inventory.service";

export const importGoods = async (req: Request, res: Response) => {
    try {
        const result = await inventoryService.importGoods(req.body);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const requestExport = async (req: Request, res: Response) => {
    try {
        const result = inventoryService.createExportRequest(req.body);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const processQueue = async (req: Request, res: Response) => {
    try {
        const result = await inventoryService.processExportQueue();
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getExpiring = async (req: Request, res: Response) => {
    try {
        const result = await inventoryService.getExpiringProducts();
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
