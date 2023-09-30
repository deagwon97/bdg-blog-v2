export interface IStorage {
  minio: any
  getPresignedUrlPutObject: (filename: string) => Promise<string>
}

export type StorageFactory = (minio: any) => IStorage
