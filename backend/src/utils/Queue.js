"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
class Queue {
    items;
    constructor() {
        this.items = [];
    }
    // Add to the end of the queue
    enqueue(item) {
        this.items.push(item);
    }
    // Remove from the front of the queue
    dequeue() {
        return this.items.shift();
    }
    // View the front item
    peek() {
        return this.items.length > 0 ? this.items[0] : undefined;
    }
    isEmpty() {
        return this.items.length === 0;
    }
    size() {
        return this.items.length;
    }
    toArray() {
        return [...this.items];
    }
}
exports.Queue = Queue;
//# sourceMappingURL=Queue.js.map