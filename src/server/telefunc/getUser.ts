export { getUser }
import { getContext, Abort } from 'telefunc'

function getUser() {
  const { loginResult } = getContext()
  if (!loginResult) {
    throw Abort({ notLoggedIn: true })
  }
  return loginResult
}
