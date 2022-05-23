import React, { ReactElement } from 'react'
import { useSpring, animated } from 'react-spring'
import stylesTooltip from './index.module.css'
import Info from '@images/info.svg'
import Tippy, { TippyProps } from '@tippyjs/react/headless'

const animation = {
  config: { tension: 400, friction: 20 },
  from: { transform: 'scale(0.5) translateY(-3rem)' },
  to: { transform: 'scale(1) translateY(0)' }
}

// Forward ref for Tippy.js
// eslint-disable-next-line
const DefaultTrigger = React.forwardRef((props, ref: any) => {
  return <Info className={stylesTooltip.icon} ref={ref} />
})

export default function Tooltip(props: TippyProps): ReactElement {
  const { content, children, trigger, disabled, className, placement } = props
  const [styles, api] = useSpring(() => animation.from)

  function onMount() {
    api.start({
      ...animation.to,
      onRest: (): void => null,
      config: animation.config
    })
  }

  function onHide({ unmount }: { unmount: () => void }) {
    api.start({
      ...animation.from,
      onRest: unmount,
      config: { ...animation.config, clamp: true }
    })
  }

  const styleClasses = `${stylesTooltip.tooltip} ${className || ''}`

  return (
    <Tippy
      interactive
      interactiveBorder={5}
      zIndex={1}
      trigger={trigger || 'mouseenter focus'}
      disabled={disabled || null}
      placement={placement || 'auto'}
      render={(attrs) => (
        <animated.div style={styles}>
          <div className={stylesTooltip.content} {...attrs}>
            {content}
            <div className={stylesTooltip.arrow} data-popper-arrow />
          </div>
        </animated.div>
      )}
      appendTo={
        typeof document !== 'undefined' && document.querySelector('body')
      }
      onMount={onMount}
      onHide={onHide}
      // animation
      {...props}
    >
      <div className={styleClasses}>{children || <DefaultTrigger />}</div>
    </Tippy>
  )
}
