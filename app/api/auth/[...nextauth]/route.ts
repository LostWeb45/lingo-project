import NextAuth from "next-auth";
import VkProvider from "next-auth/providers/vk";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    VkProvider({
      clientId: process.env.VK_CLIENT_ID || "",
      clientSecret: process.env.VK_CLIENT_SECRET || "",
    }),
  ],
};

export default NextAuth(authOptions);
