/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: [ '@uiw/react-md-editor', '@uiw/react-markdown-preview' ],
	async rewrites() {
		return [ { source: '/note/:id', destination: '/api/note/:id' } ];
	}
};

export default nextConfig;
