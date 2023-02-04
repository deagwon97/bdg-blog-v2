import 'telefunc'
import { Prisma } from '@prisma/client'

declare module 'telefunc' {
  namespace Telefunc {
    interface Context {
      userId: undefined | number
    }
  }
}
