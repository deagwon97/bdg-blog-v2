import { IStorage } from 'server/service/interface'

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

  getPresignedUrl = async (filename: string) => {
    const presignedUrl = await this.minio.presignedGetObject(
      'bdg-blog',
      filename,
      60 * 60 * 24 * 7
    )
    return presignedUrl
  }
}
