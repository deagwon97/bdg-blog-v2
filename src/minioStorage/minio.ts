var Minio = require('minio')

const minioClient = new Minio.Client({
  endPoint: process.env.NEXT_PUBLIC_MINIO_ENDPOINT || 'no-entpoint',
  useSSL: true,
  accessKey: process.env.NEXT_PUBLIC_MINIO_ACCESS_KEY || 'no-access-key',
  secretKey: process.env.NEXT_PUBLIC_MINIO_SECRET_KEY || 'no-secret-key'
})

export default minioClient
