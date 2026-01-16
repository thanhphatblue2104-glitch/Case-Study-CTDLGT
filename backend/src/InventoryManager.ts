export interface Product {
    id: number;
    name: string;
    barcode: string;
    expiryDate: Date; // Important for Min-Heap
}

export interface Order {
    id: number;
    type: 'IMPORT' | 'EXPORT';
    productId: number;
    quantity: number;
}

// Data Structure: Min-Heap (Priority Queue) for Expiry Date
class MinHeap {
    private heap: Product[] = [];

    private getParentIndex(i: number): number { return Math.floor((i - 1) / 2); }
    private getLeftChildIndex(i: number): number { return 2 * i + 1; }
    private getRightChildIndex(i: number): number { return 2 * i + 2; }

    private swap(i1: number, i2: number): void {
        const temp = this.heap[i1]!;
        this.heap[i1] = this.heap[i2]!;
        this.heap[i2] = temp;
    }

    // O(log n)
    insert(product: Product): void {
        this.heap.push(product);
        this.bubbleUp();
    }

    private bubbleUp(): void {
        let index = this.heap.length - 1;
        while (index > 0) {
            let parentIndex = this.getParentIndex(index);
            // Safe to assert ! because parentIndex < index < length
            if (this.heap[parentIndex]!.expiryDate <= this.heap[index]!.expiryDate) break;
            this.swap(index, parentIndex);
            index = parentIndex;
        }
    }

    // O(1)
    peek(): Product | undefined {
        return this.heap[0];
    }

    // O(log n)
    pop(): Product | undefined {
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

            if (rightChildIndex < this.heap.length &&
                this.heap[rightChildIndex]!.expiryDate < this.heap[smallerChildIndex]!.expiryDate) {
                smallerChildIndex = rightChildIndex;
            }

            if (this.heap[index]!.expiryDate <= this.heap[smallerChildIndex]!.expiryDate) break;

            this.swap(index, smallerChildIndex);
            index = smallerChildIndex;
        }
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }
}

// Data Structure: Queue (FIFO) for Orders
class OrderQueue {
    private queue: Order[] = [];

    // O(1)
    enqueue(order: Order): void {
        this.queue.push(order);
    }

    // O(1) mostly, technically O(n) for array shift but assumed O(1) for Queue concept explanation, 
    // real implementation usually uses linked list or cyclic buffer for strict O(1) dequeue. 
    // But Array.shift() is fine for JS simulation here.
    dequeue(): Order | undefined {
        return this.queue.shift();
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }
}

// Core Manager Class
class InventoryManager {
    // Data Structure: Hash Map for O(1) Lookup
    private productMap: Map<string, Product> = new Map();
    private expiryHeap: MinHeap = new MinHeap();
    private orderQueue: OrderQueue = new OrderQueue();

    // 1. Add Product: O(1) Map + O(log n) Heap
    addProduct(product: Product): void {
        console.log(`[Adding] ${product.name} (Exp: ${product.expiryDate.toISOString().split('T')[0]})`);
        this.productMap.set(product.barcode, product);
        this.expiryHeap.insert(product);
    }

    // 2. Add Order to Queue
    addOrder(order: Order): void {
        console.log(`[Queueing] Order #${order.id} (${order.type})`);
        this.orderQueue.enqueue(order);
    }

    // 3. Process Queue
    processQueue(): void {
        console.log("\n--- Processing Order Queue ---");
        while (!this.orderQueue.isEmpty()) {
            const order = this.orderQueue.dequeue();
            if (order) {
                console.log(`Processing Order #${order.id}: ${order.type} request for product ID ${order.productId}`);
            }
        }
        console.log("All orders processed.\n");
    }

    // 4. Get Expiring Soon (Peek Heap)
    getExpiringSoon(): Product | undefined {
        return this.expiryHeap.peek();
    }

    // 5. Fast Search (Map Lookup)
    fastSearch(barcode: string): Product | undefined {
        const start = Date.now();
        const p = this.productMap.get(barcode);
        const end = Date.now();
        console.log(`Search time for ${barcode}: ${(end - start).toFixed(4)}ms`);
        return p;
    }
}

// --- SIMULATION ---

const manager = new InventoryManager();

// Create dummy products with different expiry dates
const p1: Product = { id: 1, name: "Fresh Milk", barcode: "8930001", expiryDate: new Date("2025-05-01") }; // Expiring 2nd
const p2: Product = { id: 2, name: "Old Bread", barcode: "8930002", expiryDate: new Date("2025-04-20") };  // Expiring 1st (Earliest)
const p3: Product = { id: 3, name: "Canned Tuna", barcode: "8930003", expiryDate: new Date("2026-01-01") }; // Expiring last

console.log("--- Initializing Inventory ---");
manager.addProduct(p1);
manager.addProduct(p2);
manager.addProduct(p3);

console.log("\n--- Checking Earliest Expiry (Min-Heap Peek) ---");
const expiring = manager.getExpiringSoon();
if (expiring) {
    console.log(`⚠ ALERT: Item expiring soonest is: ${expiring.name} (Date: ${expiring.expiryDate.toISOString().split('T')[0]})`);
    // Expected: Old Bread
}

console.log("\n--- Fast Lookup (Hash Map) ---");
const found = manager.fastSearch("8930003");
if (found) {
    console.log(`found: ${found.name}`);
}

console.log("\n--- Order Queue Simulation ---");
manager.addOrder({ id: 101, type: 'IMPORT', productId: 1, quantity: 50 });
manager.addOrder({ id: 102, type: 'EXPORT', productId: 2, quantity: 10 });

manager.processQueue();
