import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AddAnnouncementBanner, {
  AnnouncementBannerProps
} from '@shared/AnnouncementBanner'

export default {
  title: 'Component/@shared/AnnouncementBanner',
  component: AddAnnouncementBanner
} as ComponentMeta<typeof AddAnnouncementBanner>

const Template: ComponentStory<typeof AddAnnouncementBanner> = (
  args: AnnouncementBannerProps
) => <AddAnnouncementBanner {...args} />

interface Props {
  args: AnnouncementBannerProps
}

export const Default: Props = Template.bind({})
Default.args = {
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada ipsum ac enim auctor placerat.',
  action: {
    name: 'see more',
    handleAction: () => {
      alert('Link clicked!')
    }
  }
}

export const Success: Props = Template.bind({})
Success.args = {
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada ipsum ac enim auctor placerat.',
  state: 'success',
  action: {
    name: 'see more',
    handleAction: () => {
      alert('Link clicked!')
    }
  }
}

export const Warning: Props = Template.bind({})
Warning.args = {
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada ipsum ac enim auctor placerat.',
  state: 'warning',
  action: {
    name: 'see more',
    handleAction: () => {
      alert('Link clicked!')
    }
  }
}

export const Error: Props = Template.bind({})
Error.args = {
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada ipsum ac enim auctor placerat.',
  state: 'error',
  action: {
    name: 'see more',
    handleAction: () => {
      alert('Link clicked!')
    }
  }
}
