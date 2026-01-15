export declare const getAllProducts: () => Promise<({
    batches: {
        id: number;
        expirationDate: Date;
        quantity: number;
        importDate: Date;
        productId: number;
    }[];
} & {
    id: number;
    barcode: string;
    name: string;
    category: string | null;
    unit: string | null;
    createdAt: Date;
})[]>;
export declare const createProduct: (data: {
    barcode: string;
    name: string;
    category?: string;
    unit?: string;
}) => Promise<{
    id: number;
    barcode: string;
    name: string;
    category: string | null;
    unit: string | null;
    createdAt: Date;
}>;
export declare const getProductById: (id: number) => Promise<({
    batches: {
        id: number;
        expirationDate: Date;
        quantity: number;
        importDate: Date;
        productId: number;
    }[];
} & {
    id: number;
    barcode: string;
    name: string;
    category: string | null;
    unit: string | null;
    createdAt: Date;
}) | null>;
//# sourceMappingURL=product.service.d.ts.map