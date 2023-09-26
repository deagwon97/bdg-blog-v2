var Minio = require('minio')

const minioClientSingleton = () => {
  const minioClient = new Minio.Client({
    endPoint: process.env.NEXT_PUBLIC_MINIO_ENDPOINT || 'no-entpoint',
    useSSL: true,
    accessKey: process.env.NEXT_PUBLIC_MINIO_ACCESSKEY || 'no-access-key',
    secretKey: process.env.NEXT_PUBLIC_MINIO_SECRETKEY || 'no-secret-key'
  })
  return minioClient
}

type MinioClientSingleton = ReturnType<typeof minioClientSingleton>

const globalForMinio = globalThis as unknown as {
  minio: MinioClientSingleton | undefined
}

const minio = globalForMinio.minio ?? minioClientSingleton()

export default minio
