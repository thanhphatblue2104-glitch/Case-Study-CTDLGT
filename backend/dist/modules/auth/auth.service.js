"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const prisma_1 = require("../../prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_change_in_prod";
const register = async (data) => {
    // Check if user exists
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new Error("User already exists");
    }
    // Hash password
    const hashedPassword = await bcrypt_1.default.hash(data.password, SALT_ROUNDS);
    // Create user
    const user = await prisma_1.prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            name: data.name ?? null,
        },
    });
    // Return user without password
    const { password, ...result } = user;
    return result;
};
exports.register = register;
const login = async (data) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { email: data.email },
    });
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isMatch = await bcrypt_1.default.compare(data.password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    // Generate Token
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
    });
    return { token, user: { id: user.id, email: user.email, name: user.name } };
};
exports.login = login;
//# sourceMappingURL=auth.service.js.map