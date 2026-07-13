import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { bootstrapAdmin } from "./admin-bootstrap";

const prisma = new PrismaClient();

bootstrapAdmin(prisma)
  .then(async (admin) => {
    console.log(`Administrator ready: ${admin.email} (${admin.role})`);
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
