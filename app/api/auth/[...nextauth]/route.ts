import NextAuth, { NextAuthOptions, DefaultSession, JWT } from "next-auth";
import VkProvider from "next-auth/providers/vk";
import YandexProvider from "next-auth/providers/yandex";

// Расширяем стандартные типы Session и JWT
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      phone?: string;
      image?: string; // Добавляем аватарку
    } & DefaultSession["user"];
  }

  interface JWT {
    phone?: string;
    picture?: string; // Добавляем аватарку в токен
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
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Добавляем данные из профиля Яндекса в токен
      if (account?.provider === "yandex" && profile) {
        const yandexProfile = profile as YandexProfile;

        // Телефон
        token.phone = yandexProfile.default_phone?.number;

        // Аватарка
        if (!yandexProfile.is_avatar_empty && yandexProfile.default_avatar_id) {
          token.picture = `https://avatars.yandex.net/get-yapic/${yandexProfile.default_avatar_id}/islands-200`;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Добавляем данные в сессию
      if (token.phone) {
        session.user.phone = token.phone;
      }
      if (token.picture) {
        session.user.image = token.picture;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
