import { render } from '@testing-library/react'
import { ReactElement } from 'react'

export default function testRender(component: ReactElement): void {
  it('renders without crashing', () => {
    const { container } = render(component)

    expect(container.firstChild).toBeInTheDocument()
  })
}
