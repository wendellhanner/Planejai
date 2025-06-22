import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Usuários de teste para o sistema
const testUsers = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@moveisplanejados.com",
    password: "admin123",
    role: "ADMIN"
  },
  {
    id: "2",
    name: "Vendedor",
    email: "vendedor@moveisplanejados.com",
    password: "vend123",
    role: "VENDEDOR"
  },
  {
    id: "3",
    name: "Produção",
    email: "producao@moveisplanejados.com",
    password: "prod123",
    role: "PRODUCAO"
  }
];

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Verificar se as credenciais correspondem a um dos usuários de teste
        const user = testUsers.find(
          (user) =>
            user.email === credentials.email &&
            user.password === credentials.password
        );

        if (user) {
          // Retornar o usuário encontrado
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          };
        }

        // No mundo real, verificaríamos contra o banco de dados
        // Neste exemplo, apenas os usuários de teste funcionam
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      // Incluir o role do usuário no token
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Adicionar informações adicionais à sessão
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === "development"
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Exportando authOptions para uso em outros arquivos
export { authOptions };
