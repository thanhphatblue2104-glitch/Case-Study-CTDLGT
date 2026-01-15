"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinHeap = void 0;
class MinHeap {
    heap;
    compare;
    constructor(compare) {
        this.heap = [];
        this.compare = compare;
    }
    getParentIndex(i) {
        return Math.floor((i - 1) / 2);
    }
    getLeftChildIndex(i) {
        return 2 * i + 1;
    }
    getRightChildIndex(i) {
        return 2 * i + 2;
    }
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    heapifyUp(i) {
        let currentIndex = i;
        while (currentIndex > 0) {
            const parentIndex = this.getParentIndex(currentIndex);
            // We know these exist because currentIndex > 0 and parentIndex < currentIndex
            if (this.compare(this.heap[currentIndex], this.heap[parentIndex]) < 0) {
                this.swap(currentIndex, parentIndex);
                currentIndex = parentIndex;
            }
            else {
                break;
            }
        }
    }
    heapifyDown(i) {
        let currentIndex = i;
        const length = this.heap.length;
        while (true) {
            const leftIndex = this.getLeftChildIndex(currentIndex);
            const rightIndex = this.getRightChildIndex(currentIndex);
            let smallestIndex = currentIndex;
            if (leftIndex < length && this.compare(this.heap[leftIndex], this.heap[smallestIndex]) < 0) {
                smallestIndex = leftIndex;
            }
            if (rightIndex < length && this.compare(this.heap[rightIndex], this.heap[smallestIndex]) < 0) {
                smallestIndex = rightIndex;
            }
            if (smallestIndex !== currentIndex) {
                this.swap(currentIndex, smallestIndex);
                currentIndex = smallestIndex;
            }
            else {
                break;
            }
        }
    }
    push(item) {
        this.heap.push(item);
        this.heapifyUp(this.heap.length - 1);
    }
    pop() {
        if (this.heap.length === 0)
            return undefined;
        if (this.heap.length === 1)
            return this.heap.pop();
        const root = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return root;
    }
    peek() {
        return this.heap.length > 0 ? this.heap[0] : undefined;
    }
    size() {
        return this.heap.length;
    }
    toArray() {
        return [...this.heap];
    }
}
exports.MinHeap = MinHeap;
//# sourceMappingURL=MinHeap.js.map