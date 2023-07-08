// import { FileMeta } from '@prisma/client'
import minioClient from 'minioStorage/minio'
// import { createFileMeta, getFilebyId } from 'server/repository/file'
// import { ErrorMessage } from 'server/types/error'
// import { getContext } from 'telefunc'

export const getPresignedUrlPutObject = async (filename: string) => {
  const presignedUrl = await minioClient.presignedPutObject(
    'bdg-blog',
    filename,
    24
  )
  return presignedUrl
}

export type GetPresignedUrl = () => Promise<string | null>
// export const onLoadPresignedUrl: GetPresignedUrl = async (fileId: number) => {
export const getPresignedUrl: GetPresignedUrl = async () => {
  // const file = await getFilebyId(fileId)
  // if (!file) {
  //   return null
  // }
  const presignedUrl = await minioClient.presignedGetObject(
    'bdg-blog',
    'test.pdf',
    60 * 60 * 24 * 7
    // file.bucket,
    // file.path,
    // 60 * 60 * 24 * 7
  )
  return presignedUrl
}

// export type UploadFile = (file: File) => Promise<FileMeta | ErrorMessage>
// export const onUploadFile: UploadFile = async (file: File) => {
//   const { userId } = getContext()
//   if (userId !== 1) {
//     return {
//       err: 'You are not authorized to upload a file'
//     } as ErrorMessage
//   }
//   const arrayBuffer = await file.arrayBuffer()
//   const buffer = Buffer.from(arrayBuffer)
//   const fileName = file.name
//   const randomString = Math.random().toString(36).slice(-20)
//   const filePath = `${randomString}-${fileName}`
//   const res = await minioClient.putObject(
//     'images',
//     file.name,
//     buffer,
//     file.size,
//     {
//       'Content-Type': file.type
//     }
//   )
//   if (!res) {
//     return {
//       err: 'upload to minio failed'
//     } as ErrorMessage
//   }
//   const fileMeta = await createFileMeta({
//     bucket: process.env.NEXT_PUBLIC_MINIO_BUCKET || 'no-bucket',
//     path: filePath,
//     name: fileName
//   })
//   if (!fileMeta) {
//     return {
//       err: 'save meta file failed'
//     } as ErrorMessage
//   }
//   return fileMeta
// }
