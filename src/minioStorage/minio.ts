var Minio = require('minio')

const minioClient = new Minio.Client({
  endPoint: process.env.NEXT_PUBLIC_MINIO_ENDPOINT || 'no-entpoint',
  useSSL: true,
  accessKey: process.env.NEXT_PUBLIC_MINIO_ACCESSKEY || 'no-access-key',
  secretKey: process.env.NEXT_PUBLIC_MINIO_SECRETKEY || 'no-secret-key'
})

console.log('minioClient', process.env.NEXT_PUBLIC_MINIO_ACCESSKEY)

export default minioClient
