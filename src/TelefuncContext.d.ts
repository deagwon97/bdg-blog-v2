import 'telefunc'
import { Prisma } from '@prisma/client'

declare module 'telefunc' {
  namespace Telefunc {
    interface Context {
      accessToken: string | undefined
    }
  }
}

import { config } from 'telefunc'

if (config) {
  config.disableNamingConvention = true
}
