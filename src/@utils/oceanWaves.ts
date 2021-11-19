import * as d3 from 'd3'

/*
 * Ocean Protocol D3 waves
 * https://oceanprotocol.com/art
 * Based off of Bostock's Circle Wave
 * https://bl.ocks.org/mbostock/2d466ec3417722e3568cd83fc35338e3
 */
export function renderStaticWaves(): string {
  const svg = d3.create('svg')
  const width = 1000
  const height = 250
  const x = d3.scaleLinear().range([0, width])
  const angles = d3.range(Math.random(), 4 * Math.PI, Math.PI / 20)

  const path = svg
    // .append('rect')
    // .attr('fill', '#fff')
    // .attr('width', '100%')
    // .attr('height', '100%')
    .append('g')
    .attr('transform', `translate(${width / -4}, ${height / 2})`)
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .selectAll('path')
    .data(['#FF4092', '#E000CF', '#8B98A9', '#E2E2E2'])
    .enter()
    .append('path')
    .attr('stroke', (d) => d)
    .style('mix-blend-mode', 'darken')
    .datum((d, i) => {
      return d3
        .line()
        .curve(d3.curveBasisOpen)
        .x((angles: any) => x(angles / 4))
        .y((angles: any) => {
          const t = d3.now() / 3000
          return (
            Math.cos(angles * 8 - (i * 2 * Math.PI) / 10 + t) *
            Math.pow((2 + Math.cos(angles - t)) / 2, 4) *
            15
          )
        })
    })

  path.attr('d', (d) => d(angles as any))

  return `<svg>${svg.node().innerHTML}</svg>`
}
