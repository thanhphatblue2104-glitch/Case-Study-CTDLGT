export class MinHeap<T> {
    private heap: T[];
    private compare: (a: T, b: T) => number;

    constructor(compare: (a: T, b: T) => number) {
        this.heap = [];
        this.compare = compare;
    }

    private getParentIndex(i: number): number {
        return Math.floor((i - 1) / 2);
    }

    private getLeftChildIndex(i: number): number {
        return 2 * i + 1;
    }

    private getRightChildIndex(i: number): number {
        return 2 * i + 2;
    }

    private swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j]!, this.heap[i]!];
    }

    private heapifyUp(i: number): void {
        let currentIndex = i;
        while (currentIndex > 0) {
            const parentIndex = this.getParentIndex(currentIndex);
            // We know these exist because currentIndex > 0 and parentIndex < currentIndex
            if (this.compare(this.heap[currentIndex]!, this.heap[parentIndex]!) < 0) {
                this.swap(currentIndex, parentIndex);
                currentIndex = parentIndex;
            } else {
                break;
            }
        }
    }

    private heapifyDown(i: number): void {
        let currentIndex = i;
        const length = this.heap.length;

        while (true) {
            const leftIndex = this.getLeftChildIndex(currentIndex);
            const rightIndex = this.getRightChildIndex(currentIndex);
            let smallestIndex = currentIndex;

            if (leftIndex < length && this.compare(this.heap[leftIndex]!, this.heap[smallestIndex]!) < 0) {
                smallestIndex = leftIndex;
            }

            if (rightIndex < length && this.compare(this.heap[rightIndex]!, this.heap[smallestIndex]!) < 0) {
                smallestIndex = rightIndex;
            }

            if (smallestIndex !== currentIndex) {
                this.swap(currentIndex, smallestIndex);
                currentIndex = smallestIndex;
            } else {
                break;
            }
        }
    }

    public push(item: T): void {
        this.heap.push(item);
        this.heapifyUp(this.heap.length - 1);
    }

    public pop(): T | undefined {
        if (this.heap.length === 0) return undefined;
        if (this.heap.length === 1) return this.heap.pop();

        const root = this.heap[0];
        this.heap[0] = this.heap.pop()!;
        this.heapifyDown(0);
        return root;
    }

    public peek(): T | undefined {
        return this.heap.length > 0 ? this.heap[0] : undefined;
    }

    public size(): number {
        return this.heap.length;
    }

    public toArray(): T[] {
        return [...this.heap];
    }
}
