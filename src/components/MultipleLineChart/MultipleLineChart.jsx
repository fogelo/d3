
import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import dayjs from "dayjs"
import { useSelector } from "react-redux";



const MultipleLineChart = ({
  data,
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  z = () => 1, // given d in data, returns the (categorical) z-value
  title, // given d in data, returns the title text
  defined, // for gaps in data
  curve = d3.curveLinear, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 1040, // outer width, in pixels
  height = 400, // outer height, in pixels
  xType = d3.scaleLinear, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  zDomain, // array of z-values
  color = "currentColor", // stroke color of line, as a constant or a function of *z*
  strokeLinecap, // stroke line cap of line
  strokeLinejoin, // stroke line join of line
  strokeWidth = 1.5, // stroke width of line
  strokeOpacity, // stroke opacity of line
  mixBlendMode = "multiply", // blend mode of lines
  voronoi // show a Voronoi overlay? (for debugging)
}
) => {
  const svgRef = useRef(null)
  const gAxisBottomRef = useRef(null)
  const gAxisLeftRef = useRef(null)
  const gChartRef = useRef(null)
  const gDotRef = useRef(null)

  useEffect(() => {
    //compute values
    const X = d3.map(data, x).map(d => new Date(d).getTime())
    const Y = d3.map(data, y)
    const Z = d3.map(data, z)
    const O = d3.map(data, d => d)
    const defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i])
    const D = d3.map(data, defined)

    // Compute default domains.
    if (yDomain === undefined) yDomain = d3.extent(Y)
    if (xDomain === undefined) xDomain = d3.extent(X)
    if (zDomain === undefined) zDomain = Z
    zDomain = new d3.InternSet(zDomain)

    // Omit any data not present in the z-domain.
    const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);


    // Construct a line generator.
    const line = d3.line()
      .defined(i => D[i])
      .curve(curve)
      .x(i => xScale(X[i]))
      .y(i => yScale(Y[i]))

    const svg = d3.select(svgRef.current)
    svg.attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic; overflow: visible;")
      .on("pointerenter", pointerentered)
      .on("pointermove", pointermoved)
      .on("pointerleave", pointerleft)

    const gAxisBottom = d3.select(gAxisBottomRef.current)
    gAxisBottom.attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis)

    const gAxisLeft = d3.select(gAxisLeftRef.current)
    gAxisLeft.attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick")
        .selectAll(".line").data([0])
        .join("line")
        .attr("class", "line")
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1)) // добавляем еще один line в .tick

    const gChart = d3.select(gChartRef.current)
    gChart.attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-opacity", strokeOpacity)
      .selectAll("path")
      .data(d3.group(I, i => Z[i]))
      .join("path")
      .attr("d", ([, I]) => line(I))


    const gDot = d3.select(gDotRef.current)
    gDot.selectAll("circle")
      .data([0])
      .join("circle")
      .attr("r", 2.5)

    gDot.selectAll("text")
      .data([0])
      .join("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("y", -8)


    function pointermoved(event) {
      const [xm, ym] = d3.pointer(event)
      const i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)) // closest point
      gChart.selectAll("path").style("stroke", ([z]) => Z[i] === z ? "red" : "").filter(([z]) => Z[i] === z).raise()
      gDot.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`)
      gDot.select("text").text(() => Z[i])
    }

    function pointerentered() {
      gChart.style("stroke", "#ddd")
      gDot.attr("display", null)
    }

    function pointerleft() {
      gChart.style("stroke", null)
      gChart.selectAll("path").style("stroke", null)
      gDot.attr("display", "none")
    }
  }, [data])

  return (
    <svg ref={svgRef}>
      <g ref={gAxisBottomRef}></g>
      <g ref={gAxisLeftRef}></g>
      <g ref={gChartRef}></g>
      <g ref={gDotRef}></g>
    </svg>
  )
};

export default MultipleLineChart
