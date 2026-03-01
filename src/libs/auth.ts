import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, genericOAuth } from "better-auth/plugins";
import prisma from "@/libs/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  session: {
    expiresIn: 60 * 60 * 24, // 1 day
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "unique",
          clientId: process.env.UNIQUE_CLIENT_ID!,
          clientSecret: process.env.UNIQUE_CLIENT_SECRET!,
          scopes: ["openid", "profile", "email"],
          discoveryUrl:
            "https://auth.uniproject.jp/.well-known/openid-configuration",
          getUserInfo: async (tokens) => {
            const response = await fetch(
              "https://auth.uniproject.jp/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                },
              },
            );
            if (!response.ok) {
              throw new Error("Failed to fetch user info");
            }
            return response.json();
          },
          overrideUserInfo: true,
          mapProfileToUser: (profile) => {
            return {
              name: profile.name,
              email: profile.email,
              image: profile.image,
              emailVerified: profile.email_verified,
              role: profile.roles.includes("admin") ? "admin" : "user",
            };
          },
        },
      ],
    }),
    admin(),
  ],
});
