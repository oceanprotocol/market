import React, { ReactElement } from 'react'
import {
  ChevronRight,
  PaperAirplaneWhite,
  PublishWhite
} from '../../../assets/images/icons'
import Button from '@shared/Button'

export interface PageHeaderProps {
  title?: string
  description?: string
}

export default function PageHeader({
  title,
  description
}: PageHeaderProps): ReactElement {
  return (
    <div className="w-full pt-2.5 h-20 bg-gray-900">
      <div className="flex items-center">
        <div>
          <ChevronRight />
        </div>
        <span className="text-gray-500 pl-2">{title || ''}</span>
      </div>
      <div className="flex pr-6">
        <span className="text-white  text-2xl grow">{description || ''}</span>

        <Button
          onClick={() => alert('Button 1 is clicked !')}
          className="mr-3"
          variant="secondary"
          size="lg"
        >
          <PaperAirplaneWhite />
          <span>New Request</span>
        </Button>

        <Button
          onClick={() => alert('Button 1 is clicked !')}
          variant="secondary"
          size="lg"
        >
          <PublishWhite />
          <span>Publish</span>
        </Button>
      </div>
    </div>
  )
}
