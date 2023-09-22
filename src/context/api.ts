// import { createContext } from 'react'
// import { Container } from 'inversify'

// const ContainerContext = createContext<Container>({} as Container)

// export default ContainerContext

import { Container } from 'inversify'
import { TYPES, IApi } from 'api/interface'
import { Api } from 'api'

const container = new Container()
container.bind<IApi>(TYPES.Api).to(Api)

export { container }

import { createContext } from 'react'

const DIContainerContext = createContext<Container | null>(null)

export default DIContainerContext
