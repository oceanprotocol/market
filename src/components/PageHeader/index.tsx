import React, { ReactElement } from 'react'
import {
  ChevronRight,
  PaperAirplaneWhite,
  PublishWhite
} from '../../assets/images/icons'
import Button from '@shared/Datanom/Button'

export default function PageHeader(): ReactElement {
  return (
    <div className="w-full pl-2.5 pt-2.5 h-20 bg-gray-900">
      <div className="flex items-center">
        <div>
          <ChevronRight />
        </div>
        <span className="text-gray-500 pl-2">DISCOVER</span>
      </div>
      <div className="flex pr-6">
        <span className="text-white pl-2 text-2xl grow">
          Latest Data Pipelines
        </span>

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
