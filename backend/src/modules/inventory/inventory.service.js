"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpiringProducts = exports.processExportQueue = exports.createExportRequest = exports.importGoods = exports.exportQueue = void 0;
const prisma_1 = require("../../prisma");
const MinHeap_1 = require("../../utils/MinHeap");
const Queue_1 = require("../../utils/Queue");
exports.exportQueue = new Queue_1.Queue();
const importGoods = async (data) => {
    // 1. Create Batch in DB
    const batch = await prisma_1.prisma.batch.create({
        data: {
            productId: data.productId,
            quantity: data.quantity,
            expirationDate: new Date(data.expirationDate),
        },
    });
    // 2. Create Import Receipt
    await prisma_1.prisma.importReceipt.create({
        data: {
            supplier: data.supplier ?? null,
            details: {
                create: {
                    batchId: batch.id,
                    quantity: data.quantity,
                },
            },
        },
    });
    return batch;
};
exports.importGoods = importGoods;
const createExportRequest = (data) => {
    exports.exportQueue.enqueue(data);
    return { message: "Request added to queue", position: exports.exportQueue.size() };
};
exports.createExportRequest = createExportRequest;
const processExportQueue = async () => {
    const results = [];
    while (!exports.exportQueue.isEmpty()) {
        const request = exports.exportQueue.dequeue();
        if (!request)
            break;
        try {
            const result = await fulfillExportRequest(request);
            results.push({ request, status: "success", result });
        }
        catch (error) {
            results.push({ request, status: "failed", error: error.message });
        }
    }
    return results;
};
exports.processExportQueue = processExportQueue;
const fulfillExportRequest = async (req) => {
    // 1. Get all batches for this product
    const batches = await prisma_1.prisma.batch.findMany({
        where: {
            productId: req.productId,
            quantity: { gt: 0 },
        },
    });
    if (batches.length === 0) {
        throw new Error(`Out of stock for product ${req.productId}`);
    }
    // 2. Build MinHeap based on Expiration Date
    const batchHeap = new MinHeap_1.MinHeap((a, b) => {
        return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
    });
    batches.forEach(b => batchHeap.push(b));
    // 3. Fulfill quantity using HEAP logic (Oldest First)
    let remaining = req.quantity;
    const exportDetails = [];
    while (remaining > 0 && batchHeap.size() > 0) {
        const currentBatch = batchHeap.pop();
        const take = Math.min(currentBatch.quantity, remaining);
        // Update DB for this batch
        await prisma_1.prisma.batch.update({
            where: { id: currentBatch.id },
            data: { quantity: currentBatch.quantity - take },
        });
        exportDetails.push({
            batchId: currentBatch.id,
            quantity: take
        });
        remaining -= take;
    }
    if (remaining > 0) {
        // In a strict transaction we might rollback, but for this demo we'll partially fulfill or throw.
        // Let's note the shortfall.
        console.warn(`Partial fulfillment. Missing ${remaining}`);
    }
    // 4. Create Export Receipt
    const receipt = await prisma_1.prisma.exportReceipt.create({
        data: {
            customer: req.customerId ?? null,
            details: {
                create: exportDetails
            }
        }
    });
    return receipt;
};
const getExpiringProducts = async () => {
    // Get all batches ensuring we check expiration
    const batches = await prisma_1.prisma.batch.findMany({
        where: { quantity: { gt: 0 } },
        include: { product: true }
    });
    // Use Heap to sort them by expiration globally (or just sort array, but let's use Heap as requested)
    const expirationHeap = new MinHeap_1.MinHeap((a, b) => {
        return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
    });
    batches.forEach(b => expirationHeap.push(b));
    // Convert heap to sorted array for display
    const sorted = [];
    while (expirationHeap.size() > 0) {
        sorted.push(expirationHeap.pop());
    }
    return sorted;
};
exports.getExpiringProducts = getExpiringProducts;
//# sourceMappingURL=inventory.service.js.map