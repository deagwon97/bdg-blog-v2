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
  }
}

const redirects = {
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

module.exports = {
  ...nextConfig,
  ...withTelefunc(),
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
