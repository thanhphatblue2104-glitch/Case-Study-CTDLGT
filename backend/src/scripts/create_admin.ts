import "dotenv/config";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";

async function main() {
    const email = "admin@example.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {}, // Don't update password if exists, just tell user standard one
        create: {
            email,
            password: hashedPassword,
            name: "Admin User"
        }
    });

    console.log(`User available: ${user.email}`);
    console.log(`Password: ${password}`); // Note: If user existed, password might be different, but we'll assume it's this or tell them to check.
    // Actually, to be safe, let's update the password to ensure it works.

    if (user) {
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });
        console.log("Password reset to default.");
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
