/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withTelefunc = require('telefunc/next').default

const nextConfig = {
  reactStrictMode: false, // to be disable twice render in useEffenct
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, '*')]
  }
}

module.exports = {
  ...nextConfig,
  ...withTelefunc(),
  images: {
    domains: ['file.minio.deagwon.com', 'deagwon.com']
  },
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
