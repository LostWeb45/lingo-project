import NextAuth, { NextAuthOptions, DefaultSession, JWT } from "next-auth";
import VkProvider from "next-auth/providers/vk";
import YandexProvider from "next-auth/providers/yandex";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma/prisma-client";
import { compare } from "bcrypt";

// Расширяем стандартные типы Session и JWT
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      phone?: string;
      image?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    phone?: string;
    picture?: string;
    role?: string;
  }
}

interface YandexProfile {
  default_phone?: {
    number: string;
  };
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
          scope: "login:email login:info login:default_phone login:avatar",
        },
      },
    }),
    VkProvider({
      clientId: process.env.VK_CLIENT_ID || "",
      clientSecret: process.env.VK_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "password", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const values = {
          email: credentials.email,
        };

        const findUser = await prisma.user.findFirst({
          where: values,
        });

        if (!findUser) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          findUser.password
        );

        if (!isPasswordValid) {
          return null;
        }

        if (!findUser.emailVerified) {
          return null;
        }

        return {
          id: String(findUser.id),
          email: findUser.email,
          name: findUser.name,
          role: findUser.role,
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
        token.phone = yandexProfile.default_phone?.number;

        if (!yandexProfile.is_avatar_empty && yandexProfile.default_avatar_id) {
          token.picture = `https://avatars.yandex.net/get-yapic/${yandexProfile.default_avatar_id}/islands-200`;
        }
      }

      // Для Credentials провайдера
      if (user) {
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.phone) {
        session.user.phone = String(token.phone);
      }
      if (token.picture) {
        session.user.image = token.picture;
      }
      if (token.role) {
        session.user.role = String(token.role);
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
