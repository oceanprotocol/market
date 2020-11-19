import { useOcean } from '@oceanprotocol/react'
import React, {
  createContext,
  useContext,
  ReactElement,
  ReactNode,
  useEffect,
  useState
} from 'react'
import Box from '3box'

interface ProfileValue {
  box: Box
  profile: any
  getProfile: () => void
}

const ProfileContext = createContext(null)

function ProfileProvider({ children }: { children: ReactNode }): ReactElement {
  const { accountId, web3Provider, status } = useOcean()
  const [box, setBox] = useState<Box>()
  const [profile, setProfile] = useState()

  const getProfile = async () => {
    const profile = await box.public.all()
    setProfile(profile)
  }

  const init3Box = async () => {
    const box = await Box.openBox(accountId, web3Provider)
    await box.syncDone
    setBox(box)
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !accountId || status !== 1) return
    init3Box()
  }, [accountId, status])

  return (
    <ProfileContext.Provider
      value={{ box, profile, getProfile } as ProfileValue}
    >
      {children}
    </ProfileContext.Provider>
  )
}

// Helper hook to access the provider values
const useProfile = (): ProfileValue => useContext(ProfileContext)
export { ProfileProvider, useProfile, ProfileValue }
