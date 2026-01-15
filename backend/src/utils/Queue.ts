export class Queue<T> {
    private items: T[];

    constructor() {
        this.items = [];
    }

    // Add to the end of the queue
    public enqueue(item: T): void {
        this.items.push(item);
    }

    // Remove from the front of the queue
    public dequeue(): T | undefined {
        return this.items.shift();
    }

    // View the front item
    public peek(): T | undefined {
        return this.items.length > 0 ? this.items[0] : undefined;
    }

    public isEmpty(): boolean {
        return this.items.length === 0;
    }

    public size(): number {
        return this.items.length;
    }

    public toArray(): T[] {
        return [...this.items];
    }
}
