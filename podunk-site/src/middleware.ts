import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if the user is trying to access protected routes
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return token !== null
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*']
}