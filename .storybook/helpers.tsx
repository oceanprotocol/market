import React from 'react'

export const Center = ({ children }: { children: any }) => (
  <div
    style={{
      height: '100vh',
      maxWidth: '35rem',
      margin: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    {children}
  </div>
)
