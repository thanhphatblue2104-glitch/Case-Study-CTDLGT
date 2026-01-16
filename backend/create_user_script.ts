import { prisma } from "./src/prisma";
import bcrypt from "bcrypt";

async function main() {
    const email = "admin@warehouse.com";
    const password = "password123";
    const name = "Admin User";

    console.log(`Creating user ${email}...`);

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                name
            },
            create: {
                email,
                password: hashedPassword,
                name
            },
        });
        console.log(`SUCCESS: User ready.`);
        console.log(`Email: ${user.email}`);
        console.log(`Password: ${password}`);
    } catch (e) {
        console.error("Error creating user:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
