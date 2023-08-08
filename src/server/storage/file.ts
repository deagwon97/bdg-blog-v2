import minioClient from 'minioStorage/minio'

export const getPresignedUrlPutObject = async (
  filename: string
): Promise<string> => {
  const presignedUrl = (await minioClient.presignedPutObject(
    'bdg-blog',
    filename,
    24
  )) as string
  return presignedUrl
}

export type GetPresignedUrl = (filename: string) => Promise<string>
export const getPresignedUrl: GetPresignedUrl = async (filename: string) => {
  const presignedUrl = await minioClient.presignedGetObject(
    'bdg-blog',
    filename,
    60 * 60 * 24 * 7
  )
  return presignedUrl
}
