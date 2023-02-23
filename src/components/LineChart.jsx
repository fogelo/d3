import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import dayjs from "dayjs"
import axios from "axios"


const LineChart = ({
  data,
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  // defined, // for gaps in data
  curve = d3.curveLinear, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  xType = d3.scaleLinear, // the x-scale type
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // the y-scale type
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  color = "currentColor", // stroke color of line
  strokeLinecap = "round", // stroke line cap of the line
  strokeLinejoin = "round", // stroke line join of the line
  strokeWidth = 1.5, // stroke width of line, in pixels
  strokeOpacity = 1 // stroke opacity of line
}
) => {
  const svgRef = useRef(null)
  const gAxisBottomRef = useRef(null)
  const axisLeftRef = useRef(null)

  const data1 = axios.get("https://gist.githubusercontent.com/fogelo/74896d030000ccef733c109ee8e08dc6/raw/3042d0ef75c028680ef438fb595dceb05b47b32e/appl.json").then(res => {
console.log(res);
  }
  )

  useEffect(() => {

    //compute values
    const X = d3.map(data, x).map(d => new Date(d).getTime())
    const Y = d3.map(data, y)
    const I = d3.range(X.length)
    const defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i])
    const D = d3.map(data, defined)


    // Compute default domains.
    if (yDomain === undefined) yDomain = d3.extent(Y)
    if (xDomain === undefined) xDomain = d3.extent(X)

    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0).tickFormat(t => dayjs(t).format("DD.MM.YYYY"))
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat)

    // Construct a line generator.
    const line = d3.line()
      .defined(i => D[i])
      .curve(curve)
      .x(i => xScale(X[i]))
      .y(i => yScale(Y[i]));

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic; overflow: visible;")

    d3.select(gAxisBottomRef.current)
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis)

    d3.select(axisLeftRef.current)
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick")
        .selectAll(".line").data([0])
        .join("line")
        .attr("class", "line")
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1)) // добавляем еще один line в ю

    svg.selectAll(".graph")
      .data([0])
      .join("path")
      .attr("class", "graph")
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-opacity", strokeOpacity)
      .attr("d", line(I));

  }, [])

  return (
    <svg ref={svgRef}>
      <g ref={gAxisBottomRef}></g>
      <g ref={axisLeftRef}></g>
    </svg>
  )
};

export default LineChart
