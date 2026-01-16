import { prisma } from "../../prisma";
import { MinHeap } from "../../utils/MinHeap";
import { Queue } from "../../utils/Queue";

// In-memory structures for demonstration (in a real distributed app, these might be Redis/DB based)
// One heap per product would be ideal, but for simplicity we might build it on the fly or cache it.
// Let's build a Heap of Batches for a specific product on demand to decide which to export.

// Queue for export requests
interface ExportRequest {
    productId: number;
    quantity: number;
    customerId?: string;
}

export const exportQueue = new Queue<ExportRequest>();

export const importGoods = async (data: {
    productId: number;
    quantity: number;
    expirationDate: string; // ISO string
    manufacturingDate?: string; // ISO string
    supplier?: string;
}) => {
    // 1. Create Batch in DB
    const batch = await prisma.batch.create({
        data: {
            productId: data.productId,
            quantity: data.quantity,
            expirationDate: new Date(data.expirationDate),
            manufacturingDate: data.manufacturingDate ? new Date(data.manufacturingDate) : new Date(),
        },
    });

    // 2. Create Import Receipt
    await prisma.importReceipt.create({
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

export const createExportRequest = (data: ExportRequest) => {
    exportQueue.enqueue(data);
    return { message: "Request added to queue", position: exportQueue.size() };
};

export const processExportQueue = async () => {
    const results = [];

    while (!exportQueue.isEmpty()) {
        const request = exportQueue.dequeue();
        if (!request) break;

        try {
            const result = await fulfillExportRequest(request);
            results.push({ request, status: "success", result });
        } catch (error: any) {
            results.push({ request, status: "failed", error: error.message });
        }
    }
    return results;
};

const fulfillExportRequest = async (req: ExportRequest) => {
    // 1. Get all batches for this product
    const batches = await prisma.batch.findMany({
        where: {
            productId: req.productId,
            quantity: { gt: 0 },
        },
    });

    if (batches.length === 0) {
        throw new Error(`Out of stock for product ${req.productId}`);
    }

    // 2. Build MinHeap based on Expiration Date
    const batchHeap = new MinHeap<typeof batches[0]>((a, b) => {
        return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
    });

    batches.forEach(b => batchHeap.push(b));

    // 3. Fulfill quantity using HEAP logic (Oldest First)
    let remaining = req.quantity;
    const exportDetails = [];

    while (remaining > 0 && batchHeap.size() > 0) {
        const currentBatch = batchHeap.pop()!;

        const take = Math.min(currentBatch.quantity, remaining);

        // Update DB for this batch
        await prisma.batch.update({
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
    const receipt = await prisma.exportReceipt.create({
        data: {
            customer: req.customerId ?? null,
            details: {
                create: exportDetails
            }
        }
    });

    return receipt;
};

export const getExpiringProducts = async () => {
    // Get all batches ensuring we check expiration
    const batches = await prisma.batch.findMany({
        where: { quantity: { gt: 0 } },
        include: { product: true }
    });

    // Use Heap to sort them by expiration globally (or just sort array, but let's use Heap as requested)
    const expirationHeap = new MinHeap<typeof batches[0]>((a, b) => {
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
