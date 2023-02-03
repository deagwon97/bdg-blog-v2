import 'telefunc'
import { Prisma } from '@prisma/client'
import { LoginResult } from 'server/types/user'

declare module 'telefunc' {
  namespace Telefunc {
    interface Context {
      loginResult: null | LoginResult
    }
  }
}
