import React, { ReactElement, useEffect, useState } from 'react'
import Ocean from '@images/logo.svg'
import H20 from '@images/h20-logo.svg'

export interface LogoProps {
  tokenLogoKey?: string
}

export default function TokenLogo({ tokenLogoKey }: LogoProps): ReactElement {
  const [logo, setLogo] = useState<ReactElement>()

  useEffect(() => {
    switch (tokenLogoKey) {
      case 'ocean':
        setLogo(<Ocean />)
        break
      case 'mocean':
        setLogo(<Ocean />)
        break
      case 'h20':
        setLogo(<H20 />)
        break
      case 'h2o':
        setLogo(<H20 />)
        break
      default:
        setLogo(<Ocean />)
        break
    }
  }, [tokenLogoKey])

  return logo
}
