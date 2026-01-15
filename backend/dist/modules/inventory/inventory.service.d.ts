import { Queue } from "../../utils/Queue";
interface ExportRequest {
    productId: number;
    quantity: number;
    customerId?: string;
}
export declare const exportQueue: Queue<ExportRequest>;
export declare const importGoods: (data: {
    productId: number;
    quantity: number;
    expirationDate: string;
    supplier?: string;
}) => Promise<{
    id: number;
    expirationDate: Date;
    quantity: number;
    importDate: Date;
    productId: number;
}>;
export declare const createExportRequest: (data: ExportRequest) => {
    message: string;
    position: number;
};
export declare const processExportQueue: () => Promise<({
    request: ExportRequest;
    status: string;
    result: {
        id: number;
        createdAt: Date;
        note: string | null;
        customer: string | null;
    };
    error?: never;
} | {
    request: ExportRequest;
    status: string;
    error: any;
    result?: never;
})[]>;
export declare const getExpiringProducts: () => Promise<(({
    product: {
        id: number;
        barcode: string;
        name: string;
        category: string | null;
        unit: string | null;
        createdAt: Date;
    };
} & {
    id: number;
    expirationDate: Date;
    quantity: number;
    importDate: Date;
    productId: number;
}) | undefined)[]>;
export {};
//# sourceMappingURL=inventory.service.d.ts.map