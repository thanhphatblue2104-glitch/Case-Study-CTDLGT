import { prisma } from "../../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_change_in_prod";

export const register = async (data: { email: string; password: string; name?: string }) => {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
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

export const login = async (data: { email: string; password: string }) => {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    // Generate Token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
    });

    return { token, user: { id: user.id, email: user.email, name: user.name } };
};

import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.Client_ID);

export const googleLogin = async (token: string) => {
    const clientId = process.env.Client_ID;
    console.log("Debug: Client_ID from env:", clientId);

    if (!clientId) {
        throw new Error("Google Client ID not configured");
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: clientId,
        });
        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            throw new Error("Invalid Google Token payload");
        }

        const { email, name } = payload;
        console.log("Debug: Google Login Success for:", email);

        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Create user if not exists
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, SALT_ROUNDS);

            user = await prisma.user.create({
                data: {
                    email,
                    name: name || "Google User",
                    password: hashedPassword,
                },
            });
        }

        // Generate Token
        const jwtToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "1h",
        });

        return { token: jwtToken, user: { id: user.id, email: user.email, name: user.name } };
    } catch (error) {
        console.error("Debug: Google Verify Error:", error);
        throw error;
    }
};
