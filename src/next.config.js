/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withTelefunc = require('telefunc/next').default

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, '*')]
  },
  images: {
    domains: ['file.minio.deagwon.com', 'deagwon.com']
  },
  env: {
    MINIO_ENDPOINT: 'file.minio.deagwon.com',
    MINIO_BUCKET_NAME: 'bdg-blog'
  }
}

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true
})

module.exports = {
  ...withPWA({
    ...nextConfig,
    ...withTelefunc()
  }),
  async redirects() {
    return [
      {
        source: '/',
        destination: '/main/',
        permanent: true
      }
    ]
  }
}
