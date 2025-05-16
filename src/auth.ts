import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { publicRequest } from "./lib/requests";
import { User } from "./types/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {
        let user: User | null = null;

        try {
          const r = await publicRequest.post('/auth/login', {
            email: credentials.email,
            password: credentials.password
          });
          console.log("[Auth] Login response:", r.data);
          
          if (r.data.access_token) {
            user = {
              id: r.data.id.toString(), // Ensure ID is a string
              name: r.data.name,
              email: r.data.email,
              role: r.data.role,
              phoneNumber: r.data.phone,
              access_token: r.data.access_token
            };
            console.log("[Auth] Created user object:", user);
          }
        }
        catch (error: unknown) {
          // Instead of throwing errors, return null
          console.error("[Auth] Login error:", error);
          return null;
        }
        
        // If no user was found, return null instead of throwing an error
        if (!user) {
          console.log("[Auth] No user object created");
          return null;
        }
        
        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async session({ session, token }) {
      console.log("[Auth] Session callback - token:", token);
      console.log("[Auth] Session callback - initial session:", session);

      if (session.user) {
        session.user.id = token.sub || '';
        session.user.role = token.role as string;
        session.user.phoneNumber = token.phoneNumber as string;
        session.user.access_token = token.access_token as string;
      }

      console.log("[Auth] Session callback - final session:", session);
      return session;
    },
    async jwt({ token, user }) {
      console.log("[Auth] JWT callback - initial token:", token);
      console.log("[Auth] JWT callback - user:", user);

      if (user) {
        token.role = user.role;
        token.phoneNumber = user.phoneNumber;
        token.access_token = user.access_token;
      }

      console.log("[Auth] JWT callback - final token:", token);
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async redirect({ url, baseUrl }) {
      console.log("[Auth] Redirect callback - url:", url);
      console.log("[Auth] Redirect callback - baseUrl:", baseUrl);

      if (url.startsWith('/')) {
        const fullUrl = `${baseUrl}${url}`;
        console.log("[Auth] Redirecting to:", fullUrl);
        return fullUrl;
      }
      else if (url.startsWith(baseUrl)) {
        console.log("[Auth] Redirecting to:", url);
        return url;
      }
      
      console.log("[Auth] Redirecting to baseUrl:", baseUrl);
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  
  pages: {
    signIn: "/auth/login",
    // Add an error page to handle displaying errors in your login form
    error: "/auth/login", 
  },

  debug: true, // Enable debug mode for more detailed logs
});
