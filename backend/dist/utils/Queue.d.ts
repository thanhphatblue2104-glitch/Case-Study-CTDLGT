export declare class Queue<T> {
    private items;
    constructor();
    enqueue(item: T): void;
    dequeue(): T | undefined;
    peek(): T | undefined;
    isEmpty(): boolean;
    size(): number;
    toArray(): T[];
}
//# sourceMappingURL=Queue.d.ts.map