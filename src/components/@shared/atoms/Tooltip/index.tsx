import React, { ReactElement, ReactNode } from 'react'
import classNames from 'classnames/bind'
import loadable from '@loadable/component'
import { useSpring, animated } from 'react-spring'
import styles from './Tooltip.module.css'
import Info from '@images/info.svg'
import { Placement } from 'tippy.js'

const cx = classNames.bind(styles)

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
  disabled,
  className,
  placement
}: {
  content: ReactNode
  children?: ReactNode
  trigger?: string
  disabled?: boolean
  className?: string
  placement?: Placement
}): ReactElement {
  const [props, setSpring] = useSpring(() => animation.from)

  function onMount() {
    setSpring({
      ...animation.to,
      onRest: (): void => null,
      config: animation.config
    })
  }

  function onHide({ unmount }: { unmount: () => void }) {
    setSpring({
      ...animation.from,
      onRest: unmount,
      config: { ...animation.config, clamp: true }
    })
  }

  const styleClasses = cx({
    tooltip: true,
    [className]: className
  })

  return (
    <Tippy
      interactive
      interactiveBorder={5}
      zIndex={1}
      trigger={trigger || 'mouseenter focus'}
      disabled={disabled || null}
      placement={placement || 'auto'}
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
        <div className={styleClasses}>{children || <DefaultTrigger />}</div>
      }
    >
      <div className={styleClasses}>{children || <DefaultTrigger />}</div>
    </Tippy>
  )
}
