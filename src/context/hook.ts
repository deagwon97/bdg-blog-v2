import { useContext } from 'react'
import DIContainerContext from 'context/api'

function useApi<T>(serviceIdentifier: symbol): T {
  const container = useContext(DIContainerContext)

  if (!container) {
    throw new Error(
      'DIContainerContext value is null. Ensure you have wrapped your component with the DIContainerContext provider.'
    )
  }

  return container.get<T>(serviceIdentifier)
}

export default useApi
