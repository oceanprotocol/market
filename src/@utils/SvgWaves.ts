import { LoggerInstance } from '@oceanprotocol/lib'
import { getRandomItemFromArray } from '.'
import { computeControlPoints } from './bezier-spline'
import { randomIntFromInterval } from './numbers'

export interface WaveProperties {
  width?: number
  height?: number
  color?: string
  fill?: boolean
  layerCount?: number
  pointsPerLayer?: number
  variance?: number
  maxOpacity?: number
  opacitySteps?: number
}

class Point {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = Math.floor(x)
    this.y = Math.floor(y)
  }
}

export class SvgWaves {
  properties: WaveProperties
  layers: Point[][]

  static xmlns = 'http://www.w3.org/2000/svg'
  // violet, pink, grey-light
  static colors = ['#e000cf', '#ff4092', '#8b98a9']

  /**
   * Helper function to get randomly generated WaveProperties
   * These are generated with a focus on small file size for the svg
   * meaning low character count.
   * - width & height: default is 2 digits max (99)
   * - a color will be randomly picked from SvgWaves.colors
   * - randomly decide if fill or stroke coloring should be used
   * - create 2 - 5 layers with 3 - 7 points per layers
   *     -> results in random looking, yet small enough svgs
   * - variance between 0.3 and 0.8 returns best results
   *     -> random, different, yet not too chaotic
   *
   * @returns new randomly generated WaveProperties
   */
  static getProps(): WaveProperties {
    return {
      width: 99,
      height: 99,
      color: getRandomItemFromArray(SvgWaves.colors),
      fill: Math.random() < 0.5, // random true or false
      layerCount: randomIntFromInterval(2, 5),
      pointsPerLayer: randomIntFromInterval(3, 7),
      variance: Math.random() * 0.5 + 0.3, // 0.3 - 0.8
      maxOpacity: 255, // 0xff
      opacitySteps: 68 // 0x44
    }
  }

  static generatePoint(
    x: number,
    y: number,
    moveX: number,
    moveY: number,
    width: number
  ): Point {
    const varianceY = y - moveY / 2 + Math.random() * moveY
    const varianceX =
      x === 0 || x === width ? x : x - moveX / 2 + Math.random() * moveX
    return new Point(varianceX, varianceY)
  }

  constructor() {
    this.properties = SvgWaves.getProps()
    this.layers = this.generateLayers()

    LoggerInstance.log('[SvgWaves] created new waves:', this)
  }

  generateLayers(): Point[][] {
    const { width, height, layerCount, pointsPerLayer, variance } =
      this.properties

    const cellWidth = width / pointsPerLayer
    const cellHeight = height / layerCount

    // define movement constraints for point generation
    // lower smoothness results in steeper curves in waves
    const horizontalSmoothness = 0.5
    const moveX = cellWidth * variance * (1 - horizontalSmoothness)
    const moveY = cellHeight * variance

    const layers = []
    for (let y = cellHeight; y < height; y += cellHeight) {
      const points = []
      for (let x = 0; x <= width; x += cellWidth) {
        points.push(SvgWaves.generatePoint(x, y, moveX, moveY, width))
      }
      layers.push(points)
    }
    return layers
  }

  generateSvg(): Element {
    const svg = document.createElementNS(SvgWaves.xmlns, 'svg')
    svg.setAttribute('width', this.properties.width.toString())
    svg.setAttribute('height', this.properties.height.toString())
    svg.setAttribute('fill', this.properties.fill ? undefined : 'transparent')
    svg.setAttribute('xmlns', SvgWaves.xmlns)

    for (let i = 0; i < this.layers.length; i++) {
      const path = this.generatePath(
        this.layers[i],
        this.getOpacityForLayer(i + 1)
      )
      svg.appendChild(path)
    }

    LoggerInstance.log('[SvgWaves] generated new svg for wave:', svg.outerHTML)
    return svg
  }

  generatePath(points: Point[], opacity = 'ff'): Element {
    const xPoints = points.map((p) => Math.floor(p.x))
    const yPoints = points.map((p) => Math.floor(p.y))

    // get bezier control points
    const xControlPoints = computeControlPoints(xPoints)
    const yControlPoints = computeControlPoints(yPoints)

    // Should the path be closed & filled or stroke only
    const closed = this.properties.fill

    // For closed paths define bottom corners as start & end point
    const bottomLeftPoint = new Point(0, this.properties.height)
    const bottomRightPoint = new Point(
      this.properties.width,
      this.properties.height
    )
    const startPoint = closed ? bottomLeftPoint : points[0]
    const endPoint = closed ? bottomRightPoint : points[points.length - 1]

    // start constructing the 'd' attribute for the <path>
    let path = `M${startPoint.x},${startPoint.y}`

    // if starting in bottom corner, move to start of wave first
    if (closed) path += `L${xPoints[0]},${yPoints[0]}`

    // add path curves
    for (let i = 0; i < xPoints.length - 1; i++) {
      path +=
        `C${xControlPoints.p1[i]},${yControlPoints.p1[i]} ` +
        `${xControlPoints.p2[i]},${yControlPoints.p2[i]} ` +
        `${xPoints[i + 1]},${yPoints[i + 1]}`
    }

    path = closed
      ? `${path}L${endPoint.x},${endPoint.y}Z` // if closing in bottom corners move there and close
      : `${path}AZ` // else just close the path

    // create the path element
    const svgPath = document.createElementNS(SvgWaves.xmlns, 'path')
    const colorStyle = closed ? 'fill' : 'stroke'
    svgPath.setAttributeNS(
      null,
      colorStyle,
      `${this.properties.color}${opacity}`
    )
    svgPath.setAttributeNS(null, 'd', path)

    return svgPath
  }

  getOpacityForLayer(layer: number): string {
    const { layerCount, maxOpacity, opacitySteps } = this.properties

    const minOpacity = maxOpacity - (layerCount - 1) * opacitySteps
    // calculate decimal opacity value for layer
    const opacityDec = minOpacity + layer * opacitySteps

    // translate to hex string
    return opacityDec.toString(16)
  }

  setProps(properties: WaveProperties): void {
    this.properties = { ...SvgWaves.getProps(), ...properties }
    this.layers = this.generateLayers()
  }
}
