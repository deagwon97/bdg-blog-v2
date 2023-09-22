import { StorageFactory } from 'server/service/interface'
import { Storage } from 'server/storage'
import minio from 'minioStorage/minioClient'

export const stoFactory: StorageFactory = (minio: any) => {
  return new Storage(minio)
}

type StorageSingleton = ReturnType<typeof stoFactory>
const globalForStorage = globalThis as unknown as {
  storage: StorageSingleton | undefined
}

const storage = globalForStorage.storage ?? stoFactory(minio)

export default storage

if (process.env.NODE_ENV !== 'production') globalForStorage.storage = storage
