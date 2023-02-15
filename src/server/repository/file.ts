import { prisma } from 'prisma/prismaClient'
import { Prisma } from '@prisma/client'

type FileMeta = Prisma.FileMetaGetPayload<{}>
export type GetFileMetabyId = (fileId: number) => Promise<FileMeta | null>
export const getFilebyId: GetFileMetabyId = async (fileId: number) => {
  let file = await prisma.fileMeta.findUnique({
    where: {
      id: fileId
    }
  })
  return file
}

export type CreateFileMeta = (
  file: Prisma.FileMetaCreateInput
) => Promise<FileMeta>
export const createFileMeta: CreateFileMeta = async (
  file: Prisma.FileMetaCreateInput
) => {
  let newFile = await prisma.fileMeta.create({
    data: file
  })
  return newFile
}
