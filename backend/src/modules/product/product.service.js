"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.createProduct = exports.getAllProducts = void 0;
const prisma_1 = require("../../prisma");
const getAllProducts = async () => {
    return await prisma_1.prisma.product.findMany({
        include: {
            batches: true,
        },
    });
};
exports.getAllProducts = getAllProducts;
const createProduct = async (data) => {
    return await prisma_1.prisma.product.create({
        data,
    });
};
exports.createProduct = createProduct;
const getProductById = async (id) => {
    return await prisma_1.prisma.product.findUnique({
        where: { id },
        include: { batches: true },
    });
};
exports.getProductById = getProductById;
//# sourceMappingURL=product.service.js.map