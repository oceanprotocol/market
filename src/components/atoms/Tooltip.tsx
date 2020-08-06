import React, { ReactElement, ReactNode } from 'react'
import loadable from '@loadable/component'
import { useSpring, animated } from 'react-spring'
import styles from './Tooltip.module.css'
import { ReactComponent as Info } from '../../images/info.svg'

const Tippy = loadable(() => import('@tippyjs/react/headless'))

const animation = {
  config: { tension: 400, friction: 20 },
  from: { transform: 'scale(0.5) translateY(-3rem)' },
  to: { transform: 'scale(1) translateY(0)' }
}

// Forward ref for Tippy.js
// eslint-disable-next-line
const DefaultTrigger = React.forwardRef((props, ref: any) => {
  return <Info className={styles.icon} ref={ref} />
})

export default function Tooltip({
  content,
  children,
  trigger,
  disabled
}: {
  content: ReactNode
  children?: ReactNode
  trigger?: string
  disabled?: boolean
}): ReactElement {
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
      interactiveBorder={5}
      zIndex={1}
      trigger={trigger || 'mouseenter focus'}
      disabled={disabled || null}
      render={(attrs: any) => (
        <animated.div style={props}>
          <div className={styles.content} {...attrs}>
            {content}
            <div className={styles.arrow} data-popper-arrow />
          </div>
        </animated.div>
      )}
      appendTo={
        typeof document !== 'undefined' && document.querySelector('body')
      }
      animation
      onMount={onMount}
      onHide={onHide}
      fallback={
        <div className={styles.tooltip}>{children || <DefaultTrigger />}</div>
      }
    >
      <div className={styles.tooltip}>{children || <DefaultTrigger />}</div>
    </Tippy>
  )
}
