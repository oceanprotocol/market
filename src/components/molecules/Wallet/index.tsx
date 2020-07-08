import React, { ReactElement } from 'react'
import loadable from '@loadable/component'
import { useSpring, animated } from 'react-spring'
import { useWeb3 } from '@oceanprotocol/react'
import Account from './Account'
import Details from './Details'

const Tippy = loadable(() => import('@tippyjs/react/headless'))

const animation = {
  config: { tension: 400, friction: 20 },
  from: { transform: 'scale(0.5) translateY(-3rem)' },
  to: { transform: 'scale(1) translateY(0)' }
}

export default function Wallet(): ReactElement {
  const { account, ethProviderStatus } = useWeb3()
  const [props, setSpring] = useSpring(() => animation.from)

  function onMount() {
    setSpring({
      transform: 'scale(1) translateY(0)',
      onRest: (): void => null,
      config: animation.config
    })
  }

  function onHide({ unmount }: { unmount: any }) {
    setSpring({
      ...animation.from,
      onRest: unmount,
      config: { ...animation.config, clamp: true }
    })
  }

  const isEthProviderAbsent = ethProviderStatus === -1
  if (isEthProviderAbsent) return null

  return (
    <Tippy
      interactive
      interactiveBorder={30}
      render={(attrs: any) => (
        <animated.div style={props}>
          <Details attrs={attrs} />
        </animated.div>
      )}
      appendTo={
        typeof document !== 'undefined' && document.querySelector('body')
      }
      animation
      onMount={onMount}
      onHide={onHide}
      disabled={!account}
      fallback={<Account />}
    >
      <Account />
    </Tippy>
  )
}
