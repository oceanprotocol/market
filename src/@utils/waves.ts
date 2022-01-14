/**
 * Implementation based on https://svgwave.in/
 * Credit to https://github.com/anup-a
 * Original: https://github.com/anup-a/svgwave/blob/main/src/core/wave.js
 */

import { computeControlPoints } from './bezier-spline'
const defaultOptions = {
  // TODO: figure out correct sizes
  width: 99,
  height: 99,
  fillColor: '#ff4092', // Ocean pink
  segmentCount: 4,
  layerCount: 4,
  variance: 0.7
}
const OPACITY_ARR = ['44', '66', '88', 'ff']
const svgns = 'http://www.w3.org/2000/svg'

export interface Point {
  x: number
  y: number
}

interface ClosedPath {
  fill: string
  d: string
}

export interface WaveProperties {
  width?: number
  height?: number
  fillColor?: string
  segmentCount?: number
  layerCount?: number
  variance?: number
}

// layercount is default to 2. Increasing the number would stack up n-1 waves.
function generatePoints(
  width: number,
  height: number,
  segmentCount: number,
  layerCount: number,
  variance: number
): Point[][] {
  const cellWidth = width / segmentCount
  const cellHeight = height / layerCount
  const moveLimitX = cellWidth * variance * 0.5
  const moveLimitY = cellHeight * variance

  const points = []
  for (let y = cellHeight; y < height; y += cellHeight) {
    const pointsPerLayer = []
    pointsPerLayer.push({ x: 0, y: Math.floor(y) })
    for (let x = cellWidth; x < width; x += cellWidth) {
      // @anup: this decides whether a segment is crest or trough
      const varietalY = y - moveLimitY / 2 + Math.random() * moveLimitY
      //   this decides the
      const varietalX = x - moveLimitX / 2 + Math.random() * moveLimitX
      pointsPerLayer.push({
        x: Math.floor(varietalX),
        y: Math.floor(varietalY)
      })
    }
    pointsPerLayer.push({ x: width, y: Math.floor(y) })
    points.push(pointsPerLayer)
  }
  return points
}

function generateClosedPath(
  curvePoints: Point[],
  leftCornerPoint: Point,
  rightCornerPoint: Point,
  fillColor: string
): ClosedPath {
  const xPoints = curvePoints.map((p) => Math.floor(p.x))
  const yPoints = curvePoints.map((p) => Math.floor(p.y))

  const xControlPoints = computeControlPoints(xPoints)
  const yControlPoints = computeControlPoints(yPoints)

  console.log('points:', {
    x: xPoints,
    y: yPoints,
    control: {
      x: xControlPoints,
      y: yControlPoints
    }
  })

  let path =
    `M${leftCornerPoint.x},${leftCornerPoint.y}` +
    `C${leftCornerPoint.x},${leftCornerPoint.y} ` +
    `${xPoints[0]},${yPoints[0]} ` +
    `${xPoints[0]},${yPoints[0]}`

  for (let i = 0; i < xPoints.length - 1; i++) {
    path +=
      `C${xControlPoints.p1[i]},${yControlPoints.p1[i]} ` +
      `${xControlPoints.p2[i]},${yControlPoints.p2[i]} ` +
      `${xPoints[i + 1]},${yPoints[i + 1]}`
  }

  path +=
    `C${xPoints[xPoints.length - 1]},${yPoints[xPoints.length - 1]} ` +
    `${rightCornerPoint.x},${rightCornerPoint.y} ` +
    `${rightCornerPoint.x},${rightCornerPoint.y}Z`

  const svgPath = document.createElementNS(svgns, 'path')
  svgPath.setAttributeNS(null, 'fill', fillColor)
  svgPath.setAttributeNS(null, 'd', path)

  return {
    fill: fillColor,
    d: path
  }
}

export class Waves {
  properties: WaveProperties
  points: Point[][]

  constructor(properties: WaveProperties) {
    this.properties = { ...defaultOptions, ...properties }
    this.points = generatePoints(
      this.properties.width,
      this.properties.height,
      this.properties.segmentCount,
      this.properties.layerCount,
      this.properties.variance
    )
  }

  generateSvg() {
    //   Creates an element with the specified namespace URI
    const svg = document.createElementNS(svgns, 'svg')
    // TODO: figure out if width,height & xmlns can be removed
    // could save characters
    // for example see https://stackoverflow.com/questions/18467982/are-svg-parameters-such-as-xmlns-and-version-needed
    svg.setAttribute('width', this.properties.width.toString())
    svg.setAttribute('height', this.properties.height.toString())
    svg.setAttribute('xmlns', svgns)

    const pathList = []
    // Append layer of a wave
    for (let i = 0; i < this.points.length; i++) {
      const pathData = generateClosedPath(
        this.points[i],
        { x: 0, y: this.properties.height },
        { x: this.properties.width, y: this.properties.height },
        this.properties.fillColor
      )
      pathList.push(pathData)
    }

    const svgData = {
      svg: {
        width: this.properties.width,
        height: this.properties.height,
        xmlns: svgns,
        path: pathList
      }
    }

    return svgData
  }

  generateSvgString() {
    const svg = this.generateSvg()
    const { width, height, xmlns, path } = svg.svg
    console.log('path:', path)
    const svgString = `
      <svg
        viewBox="0 0 ${width} ${height}"
        xmlns="${xmlns}"
      >
        ${path
          .map((p, index) => {
            const pathProps = []
            pathProps.push(
              `<path d="${p.d}" fill="${this.properties.fillColor}${OPACITY_ARR[index]}"/>`
            )
            return pathProps
          })
          .join('')}
      </svg>`

    return svgString
  }
}
