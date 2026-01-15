import { Router } from "express";
import * as inventoryController from "./inventory.controller";
import { authenticateToken } from "../../middleware/auth.middleware";

const router = Router();

// Protect all or specific routes. Let's protect all sensitive operations.
router.post("/import", authenticateToken, inventoryController.importGoods);
router.post("/export-request", authenticateToken, inventoryController.requestExport);
router.post("/process-queue", authenticateToken, inventoryController.processQueue);
router.get("/expiring", authenticateToken, inventoryController.getExpiring);

export default router;
