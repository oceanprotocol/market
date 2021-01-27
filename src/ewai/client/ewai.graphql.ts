import axios from 'axios'

export interface IGraphQlAuthConfig {
  headers: {
    Authorization: string
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IGraphQlExtensionsError {
  code: string
  exception: any
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IGraphQlError {
  message?: string
  locations?: any[]
  path?: string[]
  extensions?: IGraphQlExtensionsError[]
}

export interface IGraphQlErrorArray {
  errors?: IGraphQlError[]
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IGraphQLResultInternal {
  data?: any
  error?: string | IGraphQlErrorArray
  errors?: IGraphQlError[]
}

export interface IGraphQLResult<T> {
  message: string
  messageFull: string
  data: T | null
  axiosCallStatus: number | null
  axiosCallStatusText: string | null
}

export const GraphQlCallSuccess = 'OK'
// const AxiosCallSuccess = 200

// -------------------------------
// simple logger
// -------------------------------
function log(msg: string): void {
  if (process.env.EWAI_LOG_GQL_CALLS === 'true') {
    console.log(msg)
  }
}

// helper to call GraphQL using Axios and decipher the weird mix of
// error responses that can come back, this can only be used to
// get "one" data result object at this time which is all
// I need it to do for now. TO DO: allow it to return an array of
// named data objects for GraphQL calls which contain multiple
// queries or mutations (each with a different T though)

export async function ewaiCallGraphQlAsync<T>(
  dataName: string,
  graphQlUrl: string,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  body: any,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  config?: any
): Promise<IGraphQLResult<T>> {
  log(
    `EWAICALL('${dataName}','${graphQlUrl}','${JSON.stringify(
      body
    )}','${JSON.stringify(config)}')`
  )

  try {
    const {
      data: result,
      status,
      statusText
    } = await axios.post<IGraphQLResultInternal>(graphQlUrl, body, config)
    log(`EWAIRESULT(${status},'${statusText}','${JSON.stringify(result)}')`)
    let message: string
    let messageFull: string
    /* if (status !== AxiosCallSuccess) {
      return {
        message: statusText,
        messageFull: statusText,
        data: result.data[dataName] ? (result.data[dataName] as T) : null,
        axiosCallStatus: status,
        axiosCallStatusText: statusText
      }
    } */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    let theData: any = null
    if (result.data) {
      try {
        theData = result.data[dataName]
      } catch {
        theData = null // the requested data field didn't exist
      }
    }
    if (result.error) {
      if (typeof result.error === 'string') {
        message = result.error
        messageFull = message
      } else if (Array.isArray(result.error)) {
        /* eslint-disable prefer-destructuring */
        message = result.error.errors[0].message
        messageFull = JSON.stringify(result.error.errors)
      }
      return {
        message: message,
        messageFull: messageFull,
        data: theData as T,
        axiosCallStatus: status,
        axiosCallStatusText: statusText
      }
    } else if (result.errors && Array.isArray(result.errors)) {
      /* eslint-disable prefer-destructuring */
      message = result.errors[0].message
      messageFull = JSON.stringify(result.errors)
      return {
        message: message,
        messageFull: messageFull,
        data: theData as T,
        axiosCallStatus: status,
        axiosCallStatusText: statusText
      }
    }
    return {
      message: GraphQlCallSuccess,
      messageFull: GraphQlCallSuccess,
      data: theData as T,
      axiosCallStatus: status,
      axiosCallStatusText: statusText
    }
  } catch (error) {
    // there's not much to return in this case except info from the exception error object:
    let msg
    const s = JSON.stringify(error)
    if (error.message) {
      if (error.message.indexOf('400') !== -1) {
        msg = s
      } else {
        msg = error.message
      }
    }
    log(`EWAIRESULT('${msg}')`)
    return {
      message: msg,
      messageFull: s,
      data: null,
      axiosCallStatus: null,
      axiosCallStatusText: null
    }
  }
}
