import React, {
  createContext,
  useContext,
  ReactElement,
  ReactNode,
  useState
} from 'react'

declare type Currency = 'EUR' | 'USD'

interface UserPreferencesValue {
  debug: boolean
  currency: Currency
  setDebug: (value: boolean) => void
  setCurrency: (value: string) => void
}

const UserPreferencesContext = createContext(null)

function UserPreferencesProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const [debug, setDebug] = useState<boolean>(false)
  const [currency, setCurrency] = useState<Currency>('EUR')

  return (
    <UserPreferencesContext.Provider
      value={{ debug, currency, setDebug, setCurrency } as UserPreferencesValue}
    >
      {children}
    </UserPreferencesContext.Provider>
  )
}

// Helper hook to access the provider values
const useUserPreferences = (): UserPreferencesValue =>
  useContext(UserPreferencesContext)

export { UserPreferencesProvider, useUserPreferences, UserPreferencesValue }
