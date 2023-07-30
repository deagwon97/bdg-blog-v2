import * as user from 'server/repository/user'
import * as post from 'server/repository/post'

export const repository = {
  ...user,
  ...post
}
