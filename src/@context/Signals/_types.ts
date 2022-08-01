/**
 * an object that describes a signal for a given asset
 * @export
 * @interface AssetSignalItem
 */
export interface AssetSignalItem {
  /**
   * an identifier of the asset retrieved from the origin
   * @type {string}
   * @memberof SignalItem
   */
  assetId: string
  /**
   * a name of the signal
   * @type {string}
   * @memberof SignalItem
   */
  name: string
  /**
   * a value provided by the signal for a given asset
   * @type {string}
   * @memberof SignalItem
   */
  value: string
  /**
   * details about the signal
   * @type {string}
   * @memberof SignalItem
   */
  description: string
  [key: string]: any
}

/**
 * an object that contains a list of signals and the origin from where they come
 * @export
 * @interface SignalOriginItem
 */
export interface SignalOriginItem {
  /**
   * an identifier for a signal instance
   * @type {string}
   * @memberof SignalOriginItem
   */
  id: string
  /**
   * a string describing the title for this specific signal type instance
   * @type {string}
   * @memberof SignalOriginItem
   */
  title: string
  /**
   * @type {SignalParams} object describing the type of signal e.g account signal vs asset signal
   * @memberof SignalOriginItem
   */
  urlParams?: SignalParams
  /**
   * a string describing the type of signal e.g account signal vs asset signal
   * @type {string}
   * @memberof SignalOriginItem
   */
  type?: string
  /**
   * a unique origin/source of the signal
   * @type {string}
   * @memberof SignalOriginItem
   */
  origin: string
  /**
   * a list of signals retrieved from the given origin
   * @type {Array<AssetSignalItem>}
   * @memberof SignalOriginItem
   */
  signals: Array<AssetSignalItem>
  /**
   * a boolean representing when the signal should be displayed on the list page
   * @type {Boolean}
   * @memberof SignalSettingsItem
   */
  listView?: boolean
  /**
   * a boolean representing when the signal should be displayed on the list page
   * @type {Boolean}
   * @memberof SignalSettingsItem
   */
  detailView?: boolean
  /**
   * a boolean representing when the signal should be defined as custom on the pages
   * @type {Boolean}
   * @memberof SignalSettingsItem
   */
  isCustom: boolean
}

export interface SignalSettingsItem {
  /**
   * a time stamp of the signal settings last update
   * @type {string}
   * @memberof SignalSettingsItem
   */
  lastUpdated: string
  /**
   * a list of SignalOriginItems
   * @type {SignalOriginItem}
   * @memberof SignalSettingsItem
   */
  signals: SignalOriginItem[]
  enabled: boolean
}

export interface SignalParams {
  /**
   * a string for the asset for which we are fetching signals
   * @type {String}
   * @memberof SignalParams
   */
  assetIds: string[]
  /**
   *
   * a string for the publisher we are using as a filter signals
   * @type {String}
   * @memberof SignalParams
   */
  publisherIds?: string[]
  /**
   * a string for the userAddress we want to use as a filter signals
   * @type {String}
   * @memberof SignalParams
   */
  userAddresses?: string[]
}
