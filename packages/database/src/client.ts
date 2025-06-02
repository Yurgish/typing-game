import { PrismaClient } from "../generated/client";
import path from "path";
import { config } from "dotenv";
import { keys } from "./config";

config({ path: path.resolve(__dirname, "../../../.env") }); // Hard coded shit, idk how to solve this(

const env = keys();

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

console.log("DATABASE_URL =", env.DATABASE_URL);
