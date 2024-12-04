import { PrismaService } from "./repositories";
import { PrismaUsersRepository } from "./repositories/prisma-users-repository";

const prismaService = new PrismaService();

export const prismaUsersRepository = new PrismaUsersRepository(prismaService);
 