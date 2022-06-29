/**
 * an object that describes a signal for a given asset
 * @export
 * @interface SignalItem
 */
export interface SignalItem {
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
}

/**
 * an object that contains a list of signals and the origin from where they come
 * @export
 * @interface SignalOriginItem
 */
export interface SignalOriginItem {
  /**
   * a unique origin of the signal
   * @type {string}
   * @memberof SignalOriginItem
   */
  origin: string
  /**
   * a list of signals retrieved from the given origin
   * @type {Array<SignalItem>}
   * @memberof SignalOriginItem
   */
  signals: Array<SignalItem>
}

export interface SignalSettingsItem {
  /**
   * a unique name of the signal
   * @type {string}
   * @memberof SignalSettingsItem
   */
  name: string
  /**
   * a unique origin of the signal
   * @type {string}
   * @memberof SignalSettingsItem
   */
  origin: string
  /**
   * a boolean representing when the signal should be displayed on the list page
   * @type {Boolean}
   * @memberof SignalSettingsItem
   */
  listView: boolean
  /**
   * a boolean representing when the signal should be displayed on the list page
   * @type {Boolean}
   * @memberof SignalSettingsItem
   */
  detailView: boolean
}

export interface SignalParams {
  /**
   * a string for the asset for which we are fetching signals
   * @type {String}
   * @memberof SignalParams
   */
  assetId: string
  /**
   * a string for the publisher we are using as a filter signals
   * @type {String}
   * @memberof SignalParams
   */
  publisherId?: string
  /**
   * a string for the userAddress we want to use as a filter signals
   * @type {String}
   * @memberof SignalParams
   */
  userAddress?: string
}
