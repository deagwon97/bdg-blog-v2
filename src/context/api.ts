import { Container } from 'inversify'
import { createContext } from 'react'
import { TYPES, IApi } from 'apiClient/interface'
import { Api } from 'apiClient'

const DIContainerContext = createContext<Container | null>(null)
const container = new Container()
container.bind<IApi>(TYPES.Api).to(Api)

export { container }
export default DIContainerContext
