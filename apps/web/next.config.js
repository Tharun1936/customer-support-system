/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		// In development, proxy all /api requests to the locally running backend
		if (process.env.NODE_ENV !== 'production') {
			return [
				{
					source: '/api/:path*',
					destination: 'http://localhost:3001/api/:path*',
				},
			]
		}
		return []
	},
}

export default nextConfig;
