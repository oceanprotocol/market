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
   * an origin of the signal
   * @type {string}
   * @memberof SignalOriginItem
   */
  origin: string
  /**
   * a list of signals retrived from the given origin
   * @type {Array<SignalItem>}
   * @memberof SignalOriginItem
   */
  signals: Array<SignalItem>
}

export interface SignalOriginList {
  /**
   * an origin of the signal
   * @type {string}
   * @memberof SignalOriginItem
   */
  origin: string
  /**
   * a list of signals retrived from the given origin
   * @type {Array<SignalItem>}
   * @memberof SignalOriginItem
   */
  signals: Array<SignalItem>
}
