import NextAuth from "next-auth";
import VkProvider from "next-auth/providers/vk";
import YandexProvider from "next-auth/providers/yandex";

export const authOptions = {
  providers: [
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "login:email login:info",
          // login:phone
        },
      },
    }),

    VkProvider({
      clientId: process.env.VK_CLIENT_ID || "",
      clientSecret: process.env.VK_CLIENT_SECRET || "",
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
