import React, { ReactElement } from 'react'
import loadable from '@loadable/component'
import { useSpring, animated } from 'react-spring'
import Account from './Account'
import Details from './Details'
import styles from './index.module.css'
import { useOcean } from '@oceanprotocol/react'

const Tippy = loadable(() => import('@tippyjs/react/headless'))

const animation = {
  config: { tension: 400, friction: 20 },
  from: { transform: 'scale(0.5) translateY(-3rem)' },
  to: { transform: 'scale(1) translateY(0)' }
}

export default function Wallet(): ReactElement {
  const { accountId } = useOcean()
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

  return (
    <Tippy
      interactive
      interactiveBorder={30}
      trigger="click focus"
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
      disabled={!accountId}
      fallback={<Account />}
    >
      <Account />
    </Tippy>
  )
}
