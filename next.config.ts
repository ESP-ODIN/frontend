import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  redirects() {
    return [
      // Old auth routes, kept so existing links and bookmarks still work
      { source: "/log-in", destination: "/login", permanent: true },
      { source: "/sign-in", destination: "/register", permanent: true },
    ]
  },
}

export default nextConfig
