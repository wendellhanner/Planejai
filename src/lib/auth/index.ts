import { compare, hash } from "@/lib/auth/password";
import { PrismaClient } from "@prisma/client";
import type { User } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Exportando auth para corrigir os erros de importação
export const auth = authOptions;

const prisma = new PrismaClient();

// Usuário de demonstração para permitir login sem banco de dados
const demoUser = {
  id: "demo-user-id",
  name: "Usuário Demonstração",
  email: "demo@moveisplanejados.com",
  password: "senha123-hashed", // Será comparado diretamente
  role: "VENDEDOR",
  createdAt: new Date(),
  updatedAt: new Date()
};

export async function getUserByEmail(email: string) {
  try {
    // Se for o email de demonstração, retorna o usuário demo
    if (email === "demo@moveisplanejados.com") {
      return demoUser;
    }

    // Caso contrário, tenta buscar do banco de dados
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}

export async function createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">) {
  try {
    const hashedPassword = await hash(user.password);

    return await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
}

export async function validateUser(email: string, password: string) {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return null;
    }

    // Caso especial para o usuário de demonstração
    if (user.id === "demo-user-id" && password === "senha123") {
      return user;
    }

    const passwordValid = await compare(password, user.password);

    if (!passwordValid) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Erro ao validar usuário:", error);
    return null;
  }
}

export { hash, compare } from "./password";
