import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // redirect to homepage login
  },
});

// Protect specific routes
export const config = {
  matcher: ["/wallet", "/success", "/error"],
};
