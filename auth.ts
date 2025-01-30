import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn ({ user }){
      if (user){
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/sesiones/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            api_key: process.env.NEXT_PUBLIC_API_KEY || '',
          },
          body: JSON.stringify({ correo: user.email }),
        });
        if (response.ok){
          return true;
        }
        return '/';
      }
      return '/';
    },
    async jwt({ token, user }) {
      if (user) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/sesiones/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            api_key: process.env.NEXT_PUBLIC_API_KEY || '',
          },
          body: JSON.stringify({ correo: user.email }),
        });

        if (response.ok) {
          const data = await response.json();
          token.accessToken = data.token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});
