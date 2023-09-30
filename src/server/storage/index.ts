import { IStorage } from 'server/service/storageInterface'

export class Storage implements IStorage {
  minio: any
  constructor(minio: any) {
    this.minio = minio
  }

  getPresignedUrlPutObject = async (filename: string): Promise<string> => {
    const presignedUrl = (await this.minio.presignedPutObject(
      'bdg-blog',
      filename,
      24
    )) as string
    return presignedUrl
  }
}
