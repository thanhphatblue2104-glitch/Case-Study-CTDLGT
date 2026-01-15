export declare class MinHeap<T> {
    private heap;
    private compare;
    constructor(compare: (a: T, b: T) => number);
    private getParentIndex;
    private getLeftChildIndex;
    private getRightChildIndex;
    private swap;
    private heapifyUp;
    private heapifyDown;
    push(item: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    size(): number;
    toArray(): T[];
}
//# sourceMappingURL=MinHeap.d.ts.map