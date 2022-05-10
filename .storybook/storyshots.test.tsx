import initStoryshots from '@storybook/addon-storyshots'
import { render, waitFor } from '@testing-library/react'

const reactTestingLibrarySerializer = {
  print: (val, serialize, indent) => serialize(val.container.firstChild),
  test: (val) => val && val.hasOwnProperty('container')
}

// Stories are render-tested with @testing-library/react,
// overwriting default snapshot testing behavior
// initStoryshots({
//   renderer: render,
//   snapshotSerializers: [reactTestingLibrarySerializer]
// })

initStoryshots({
  asyncJest: true,
  test: async ({ story, done }) => {
    const storyElement = story.render()
    // render the story with @testing-library/react
    render(storyElement)
    await waitFor(() => done())
  }
})
