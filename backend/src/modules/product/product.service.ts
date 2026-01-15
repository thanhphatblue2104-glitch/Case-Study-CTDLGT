import { prisma } from "../../prisma";


export const searchProducts = async (query: string) => {
    return await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { barcode: { contains: query } },
            ],
        },
        include: {
            batches: true,
        },
    });
};

export const getAllProducts = async () => {
    return await prisma.product.findMany({
        include: {
            batches: true,
        },
    });
};

export const createProduct = async (data: {
    barcode: string;
    name: string;
    category?: string;
    unit?: string;
}) => {
    return await prisma.product.create({
        data,
    });
};

export const getProductById = async (id: number) => {
    return await prisma.product.findUnique({
        where: { id },
        include: { batches: true },
    });
};
