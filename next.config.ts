import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  redirects() {
    return [
      { source: "/log-in", destination: "/login", permanent: true },
      { source: "/sign-in", destination: "/register", permanent: true },
    ]
  },
}

export default nextConfig
