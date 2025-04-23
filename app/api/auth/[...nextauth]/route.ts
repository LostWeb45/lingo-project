import NextAuth, { NextAuthOptions, DefaultSession, JWT } from "next-auth";
import YandexProvider from "next-auth/providers/yandex";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma/prisma-client";
import { compare, hash } from "bcrypt";

// Расширяем стандартные типы Session и JWT
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      image?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    picture?: string;
    role?: string;
  }
}

interface YandexProfile {
  is_avatar_empty?: boolean;
  default_avatar_id?: string;
  login?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "login:email login:info login:avatar",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // if (!credentials?.email || !credentials?.password) {
        //   return null;
        // }

        const hashedPassword = await hash(credentials.password, 10);

        const user = await prisma.user.create({
          data: {
            email: credentials.email,
            password: hashedPassword, // Хешируем и сохраняем
            name: credentials.name,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        console.log("Введённый пароль:", credentials.password);
        console.log("Хешированный пароль:", user.password);
        const isPasswordValid = await compare(
          credentials.password.trim(),
          user.password.trim()
        );

        // if (!isPasswordValid || !user.emailVerified) {
        if (!isPasswordValid) {
          return null;
        }
        //
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Для Яндекс провайдера
      if (account?.provider === "yandex" && profile) {
        const yandexProfile = profile as YandexProfile;

        if (!yandexProfile.is_avatar_empty && yandexProfile.default_avatar_id) {
          token.picture = `https://avatars.yandex.net/get-yapic/${yandexProfile.default_avatar_id}/islands-200`;
        }
      }

      if (account?.provider == "credentials") {
        const findUser = await prisma.user.findFirst({
          where: {
            email: token.email as string,
          },
        });

        if (findUser) {
          token.id = String(findUser.id);
          token.email = findUser.email;
          token.role = findUser.role;
          token.name = findUser.name;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      if (token.picture) {
        session.user.image = token.picture;
      }
      if (token.role) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
