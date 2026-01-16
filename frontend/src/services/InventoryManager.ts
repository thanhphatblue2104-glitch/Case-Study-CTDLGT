import type { Product, Batch } from '../types';

export interface Order {
    id: number;
    type: 'IMPORT' | 'EXPORT';
    productId: number;
    quantity: number;
    timestamp: Date;
}

// Data Structure: Min-Heap (Priority Queue) for Expiry Date
class MinHeap {
    private heap: Batch[] = [];

    private getParentIndex(i: number): number { return Math.floor((i - 1) / 2); }
    private getLeftChildIndex(i: number): number { return 2 * i + 1; }
    private getRightChildIndex(i: number): number { return 2 * i + 2; }

    private swap(i1: number, i2: number): void {
        const temp = this.heap[i1]!;
        this.heap[i1] = this.heap[i2]!;
        this.heap[i2] = temp;
    }

    // Complexity: O(log n) - Inserting requires bubbling up the tree height
    insert(batch: Batch): void {
        this.heap.push(batch);
        this.bubbleUp();
    }

    private bubbleUp(): void {
        let index = this.heap.length - 1;
        while (index > 0) {
            let parentIndex = this.getParentIndex(index);
            // Safe to assert ! because parentIndex < index < length
            if (new Date(this.heap[parentIndex]!.expirationDate) <= new Date(this.heap[index]!.expirationDate)) break;
            this.swap(index, parentIndex);
            index = parentIndex;
        }
    }

    // Complexity: O(1) - The minimum element is always at the root
    peek(): Batch | undefined {
        return this.heap[0];
    }

    // Complexity: O(log n) - Removing root requires bubbling down the tree height
    pop(): Batch | undefined {
        if (this.heap.length === 0) return undefined;
        const root = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0 && last) {
            this.heap[0] = last;
            this.bubbleDown();
        }
        return root;
    }

    private bubbleDown(): void {
        let index = 0;
        while (this.getLeftChildIndex(index) < this.heap.length) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            let rightChildIndex = this.getRightChildIndex(index);

            const rightChild = this.heap[rightChildIndex];
            const smallerChild = this.heap[smallerChildIndex];

            if (rightChildIndex < this.heap.length && rightChild && smallerChild &&
                new Date(rightChild.expirationDate) < new Date(smallerChild.expirationDate)) {
                smallerChildIndex = rightChildIndex;
            }

            const current = this.heap[index];
            const nextSmaller = this.heap[smallerChildIndex];

            if (current && nextSmaller && new Date(current.expirationDate) <= new Date(nextSmaller.expirationDate)) break;

            this.swap(index, smallerChildIndex);
            index = smallerChildIndex;
        }
    }

    // Complexity: O(1)
    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    // Complexity: O(n) - Clearing the array
    clear(): void {
        this.heap = [];
    }

    // Complexity: O(n log n) - Extracting k items requires k pops, but cloning and sorting is simpler for "peeking" top k without modifying heap state
    // For this specific requirement "getTopExpiring", we will implement non-destructive retrieval
    getTopK(k: number): Batch[] {
        // Clone heap to avoid modifying the actual data structure
        const clone = [...this.heap];
        // Sort clone - Complexity: O(n log n)
        // Note: A true heap sort extract would be O(k log n), but for JS array simplicity and small k, sorting is acceptable/robust.
        // However, to strictly follow Heap logic, we could clone the heap structure and pop k times.
        return clone.sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()).slice(0, k);
    }
}

// Data Structure: Queue (FIFO) for Orders
class OrderQueue {
    private queue: Order[] = [];
    private history: Order[] = [];

    // Complexity: O(1)
    enqueue(order: Order): void {
        this.queue.push(order);
        this.history.unshift(order); // Keep history for "Recent Activity" UI (Newest first)
    }

    // Complexity: O(n) - Array.shift() shifts all elements. O(1) if using linked list.
    dequeue(): Order | undefined {
        return this.queue.shift();
    }

    // Complexity: O(1)
    getHistory(): Order[] {
        return this.history;
    }
}

// Core Manager Class
class InventoryManager {
    // Data Structure: Hash Map for O(1) Lookup
    private productMap: Map<string, Batch> = new Map(); // Mapping Barcode/ID -> Batch (Simplification: Assuming 1 batch per barcode for search demo, or mapping to list)
    // Actually, for "Fast Search", we usually search by Product Barcode. One Product can have multiple batches.
    // Let's Map Barcode -> List of Batches for that product.
    private barcodeMap: Map<string, Batch[]> = new Map();

    private expiryHeap: MinHeap = new MinHeap();
    public orderQueue: OrderQueue = new OrderQueue();

    // Complexity: O(1) Map + O(log n) Heap
    addBatch(batch: Batch): void {
        // @ts-ignore
        const barcode = batch.product?.barcode || "";

        // Update Map
        if (barcode) {
            const existing = this.barcodeMap.get(barcode) || [];
            existing.push(batch);
            this.barcodeMap.set(barcode, existing);
        }

        // Update Heap
        this.expiryHeap.insert(batch);
    }

    // Complexity: O(n) - Clearing all structures
    clear(): void {
        this.barcodeMap.clear();
        this.expiryHeap.clear();
    }

    // Complexity: O(1) - Direct Map Lookup
    fastSearch(barcode: string): Batch[] | undefined {
        // console.log(`[Fast Search] Searching for ${barcode}...`);
        return this.barcodeMap.get(barcode);
    }

    // Complexity: O(k log n) or O(n log n) depending on implementation in Heap
    getTopExpiring(k: number): Batch[] {
        return this.expiryHeap.getTopK(k);
    }

    // Complexity: O(1)
    addOrder(order: Order): void {
        this.orderQueue.enqueue(order);
    }
}

// Singleton Instance
export const inventoryManager = new InventoryManager();
