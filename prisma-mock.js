// Este arquivo é um mock do Prisma Client para uso durante o build no Netlify
// Ele substitui o Prisma Client real para evitar erros de inicialização

const PrismaMock = {
  user: {
    findUnique: () => Promise.resolve(null),
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({})
  },
  // Adicione outros modelos conforme necessário
  $connect: () => Promise.resolve(),
  $disconnect: () => Promise.resolve()
};

module.exports = {
  PrismaClient: function() {
    return PrismaMock;
  }
};
