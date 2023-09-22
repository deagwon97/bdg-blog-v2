import { Container } from 'inversify'
import { createContext } from 'react'
import { TYPES, IApi } from 'api/interface'
import { Api } from 'api'

const DIContainerContext = createContext<Container | null>(null)
const container = new Container()
container.bind<IApi>(TYPES.Api).to(Api)

export { container }
export default DIContainerContext
