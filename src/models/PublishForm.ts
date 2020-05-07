import { UiSchema } from 'react-jsonschema-form'
import { JSONSchema6 } from 'json-schema'
import TermsWidget from '../components/atoms/FormWidgets/TermsWidget'
import DateRangeWidget from '../components/atoms/FormWidgets/DateRangeWidget'
import { ObjectFieldTemplate } from '../components/molecules/Form/ObjectFieldTemplate'
import { Granularity } from '../@types/MetaData'
import FileField from '../components/molecules/Form/FileField'

export const customWidgets = {
  TermsWidget,
  DateRangeWidget
}

// Ref: https://react-jsonschema-form.readthedocs.io/en/latest/form-customization/#the-uischema-object
export const CATEGORIES = [
  'Invoices',
  'Historical location-based data',
  'Shipment attribute (without rate information)',
  'Shipment attribute (with rate information)',
  'Other'
]
export const PublishFormSchema: JSONSchema6 = {
  type: 'object',
  required: [
    'category',
    'title',
    'author',
    'license',
    'price',
    'files',
    'granularity',
    'summary',
    'termsAndConditions'
  ],
  definitions: {
    files: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        }
      }
    }
  },
  properties: {
    category: {
      type: 'string',
      title: 'What type of data will you be providing?',
      enum: CATEGORIES
    },
    title: {
      type: 'string',
      title: 'Offer Title'
    },
    summary: {
      type: 'string',
      title: 'Summary',
      minLength: 24
    },
    files: {
      type: 'array',
      title: 'Data File URL',
      items: {
        type: 'string',
        title: 'File URL',
        format: 'uri'
      }
    },
    price: {
      title: 'Price',
      type: 'number',
      minimum: 0
    },
    granularity: {
      type: 'string',
      title: 'Granularity of Data',
      enum: [
        'Not updated periodically',
        'Hourly',
        'Daily',
        'Weekly',
        'Monthly',
        'Annually'
      ]
    },
    author: {
      type: 'string',
      title: 'Author'
    },
    license: {
      title: 'License',
      type: 'string',
      enum: [
        'Public Domain',
        'PDDL: Public Domain Dedication and License',
        'ODC-By: Attribution License',
        'ODC-ODbL: Open Database License',
        'CDLA-Sharing: Community Data License Agreement',
        'CDLA-Permissive: Community Data License Agreement',
        'CC0: Public Domain Dedication',
        'CC BY: Attribution 4.0 International',
        'CC BY-SA: Attribution-ShareAlike 4.0 International',
        'CC BY-ND: Attribution-NoDerivatives 4.0 International',
        'CC BY-NC: Attribution-NonCommercial 4.0 International',
        'CC BY-NC-SA: Attribution-NonCommercial-ShareAlike 4.0 International',
        'CC BY-NC-ND: Attribution-NonCommercial-NoDerivatives 4.0 International',
        'No License Specified'
      ]
    },
    dateRange: {
      type: 'string',
      title: 'Creation Date'
    },
    holder: {
      type: 'string',
      title: 'Copyright Holder'
    },
    keywords: {
      type: 'string',
      title: 'Keywords'
    },
    supportName: {
      type: 'string',
      title: 'Support Name'
    },
    supportEmail: {
      type: 'string',
      format: 'email',
      title: 'Support Email Address'
    },
    termsAndConditions: {
      type: 'boolean',
      title: 'I agree to these Terms and Conditions'
    }
  }
}
// Widgets Ref https://react-jsonschema-form.readthedocs.io/en/latest/form-customization/#alternative-widgets
export const PublishFormUiSchema: UiSchema = {
  'ui:ObjectFieldTemplate': ObjectFieldTemplate,
  category: {
    'ui:widget': 'radio'
  },
  title: {
    'ui:placeholder': 'e.g. Shapes of Desert Plants',
    'ui:help': 'Enter a concise title.'
  },
  summary: {
    'ui:placeholder': 'Max of 1000 characters',
    'ui:widget': 'textarea',
    'ui:help': 'Add a thorough description with as much detail as possible.'
  },
  files: {
    'ui:ArrayFieldTemplate': FileField,
    items: {
      'ui:placeholder': 'e.g. https://file.com/file.json',
      'ui:widget': 'uri',
      classNames: 'input-file'
    },
    'ui:help': 'Please provide a URL to your data set file.'
  },
  price: {
    'ui:help': 'Set your price in Ocean Tokens.'
  },
  granularity: {
    'ui:widget': 'select',
    'ui:help': 'Select the timeframe your data was collected.'
  },
  author: {
    'ui:placeholder': 'e.g. Jelly McJellyfish',
    'ui:help': 'Give proper attribution for your data set.'
  },
  license: {
    'ui:widget': 'select'
  },
  dateRange: {
    'ui:widget': 'DateRangeWidget',
    'ui:help':
      'Select the date the asset was created, or was updated for the last time.'
  },
  holder: {
    'ui:placeholder': 'e.g. Marine Institute of Jellyfish'
  },
  keywords: {
    'ui:placeholder': 'shipment, logistics'
  },
  termsAndConditions: {
    'ui:widget': 'TermsWidget'
  }
}

export interface PublishFormDataInterface {
  // ---- required fields ----
  category: string
  granularity: Granularity
  summary: string
  termsAndConditions: boolean
  author: string
  license: string
  files: string[]
  price: number
  title: string
  // ---- optional fields ----
  dateRange?: string
  holder?: string
  keywords?: string
  supportEmail?: string
  supportName?: string
}
// Ref: https://github.com/oceanprotocol/OEPs/blob/master/8/v0.4/README.md#main-attributes
export const publishFormData: PublishFormDataInterface = {
  author: '',
  price: 0,
  title: '',
  files: [''], // should be empty string initially to display the expanded field
  summary: '',
  category: '',
  granularity: '',
  license: '',
  termsAndConditions: false,
  dateRange: undefined,
  holder: undefined,
  keywords: undefined,
  supportName: undefined,
  supportEmail: undefined
}
/* 
Missing fields:
links: []

*/
