import NextAuth, { NextAuthOptions, DefaultSession, JWT } from "next-auth";
import VkProvider from "next-auth/providers/vk";
import YandexProvider from "next-auth/providers/yandex";

// Расширяем стандартные типы Session и JWT
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      phone?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    phone?: string;
  }
}

interface YandexProfile {
  default_phone?: {
    number: string;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "login:email login:info login:default_phone",
        },
      },
    }),
    VkProvider({
      clientId: process.env.VK_CLIENT_ID || "",
      clientSecret: process.env.VK_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "yandex" && profile) {
        const yandexProfile = profile as YandexProfile;
        token.phone = yandexProfile.default_phone?.number;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.phone) {
        session.user.phone = token.phone;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
