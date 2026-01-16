import { Router } from "express";
import * as inventoryController from "./inventory.controller";


const router = Router();

// Protect all or specific routes. Let's protect all sensitive operations.
router.post("/import", inventoryController.importGoods);
router.post("/export-request", inventoryController.requestExport);
router.post("/process-queue", inventoryController.processQueue);
router.get("/expiring", inventoryController.getExpiring);

export default router;
