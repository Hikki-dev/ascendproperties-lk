import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@ascend.lk" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Simple admin check against env variables
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (
          credentials?.email === adminEmail && 
          credentials?.password === adminPassword &&
          adminEmail && adminPassword
        ) {
          return {
            id: "admin-user",
            name: "Admin User",
            email: adminEmail,
            image: "https://placehold.co/100x100/1877F2/FFFFFF?text=Admin",
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // session.user.id = token.sub!; // Add user ID to session if needed
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
