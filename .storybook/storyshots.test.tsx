import initStoryshots from '@storybook/addon-storyshots'
import { render, waitFor } from '@testing-library/react'

// Stories are render-tested with @testing-library/react,
// overwriting default snapshot testing behavior
initStoryshots({
  asyncJest: true,
  test: async ({ story, done }) => {
    const storyElement = story.render()
    // render the story with @testing-library/react
    render(storyElement)
    await waitFor(() => done())
  }
})
