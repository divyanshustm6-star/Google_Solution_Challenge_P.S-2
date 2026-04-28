import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Custom logic if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/shipments/:path*", "/alerts/:path*", "/analytics/:path*"]
}
