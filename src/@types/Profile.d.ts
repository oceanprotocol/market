interface ProfileLink {
  key: string
  value: string
}

interface Profile {
  name: string
  url?: string
  avatar?: string
  description?: string
  links?: ProfileLink[]
}
