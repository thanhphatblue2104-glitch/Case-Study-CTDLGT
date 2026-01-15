export interface Product {
    id: number;
    barcode: string;
    name: string;
    category?: string;
    unit?: string;
    createdAt: string;
    updatedAt: string;
    batches?: Batch[];
}

export interface Batch {
    id: number;
    productId: number;
    quantity: number;
    expirationDate: string;
    createdAt: string;
}

export interface ExportRequest {
    productId: number;
    quantity: number;
    customerId?: string;
}

export interface ExportResult {
    message: string;
    position: number;
}
