/* eslint-disable react/prop-types */
import { useEffect, useRef, useMemo, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import * as d3 from "d3";

const AreaGraph = ({ data, title, _id, onAddData, onDeleteData }) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const svgContainer = useRef(null);

  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

  const getSvgContainerSize = () => {
    const newWidth = svgContainer.current.clientWidth;
    setWidth(newWidth);

    const newHeight = svgContainer.current.clientHeight;
    setHeight(newHeight);
  };

  // Memoize the parsed data
  const parsedData = useMemo(() => {
    // Parse the date strings into Date objects
    const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
    // Modify the data to replace date strings with Date objects
    return data.map((d) => ({
      dataVal: d.dataVal,
      date: parseDate(d.date),
    }));
  }, [data]);

  useEffect(() => {
    getSvgContainerSize();
    window.addEventListener("resize", getSvgContainerSize);
    return () => window.removeEventListener("resize", getSvgContainerSize);
  }, []);

  // Preprocess data to extract unique months
  const uniqueMonths = Array.from(
    new Set(parsedData.map((d) => d.date.getMonth()))
  );

  const handleAddData = () => {
    onAddData(_id);
  };

  const handleDeleteData = () => {
    onDeleteData(_id);
  };

  useEffect(() => {
    let xAccessor;
    let yAccessor;

    xAccessor = (d) => d.date;
    yAccessor = (d) => d.dataVal;

    // Dimensions
    let dimensions = {
      width: width, // width from state
      height: height, // height from state
      margins: 50,
    };

    dimensions.containerWidth = dimensions.width - dimensions.margins * 2;
    dimensions.containerHeight = dimensions.height - dimensions.margins * 2;

    const svg = d3
      .select(svgRef.current)
      .classed("line-chart-svg", true)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    const everything = svg.select("*");
    everything.remove();

    const container = svg
      .append("g")
      .classed("container", true)
      .attr(
        "transform",
        `translate(${dimensions.margins}, ${dimensions.margins})`
      );

    const tooltip = d3.select(tooltipRef.current);
    const tooltipDot = container
      .append("circle")
      .datum(parsedData)
      .classed("tool-tip-dot", true)
      .attr("r", 5)
      .attr("fill", "#fc8781")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .style("opacity", 0)
      .style("pointer-events", "none");

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(parsedData, yAccessor) + 5])
      .range([dimensions.containerHeight, 0])
      .nice();

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(parsedData, xAccessor))
      .range([0, dimensions.containerWidth]);

    const lineGenerator = d3
      .line()
      .x((d) => xScale(xAccessor(d)))
      .y((d) => yScale(yAccessor(d)));

    container
      .append("path")
      .datum(parsedData)
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", "#30475e")
      .attr("stroke-width", 2);

    container
      .selectAll("circle")
      .data(parsedData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(xAccessor(d)))
      .attr("cy", (d) => yScale(yAccessor(d)))
      .attr("r", 5)
      .attr("fill", "darkorange")
      .attr("opacity", 1);

    container
      .append("circle")
      .attr("cx", xScale(xAccessor(parsedData[0])))
      .attr("cy", yScale(yAccessor(parsedData[0])))
      .attr("r", 5)
      .attr("fill", "darkorange")
      .attr("opacity", 1);

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat((d) => `${d}`);

    const yAxisGroup = container.append("g").classed("yAxis", true).call(yAxis);

    yAxisGroup
      .append("text")
      .attr("x", -dimensions.containerHeight / 2)
      .attr("y", -dimensions.margins + 10)
      .attr("fill", "black")
      .text(title)
      .style("font-size", ".8rem")
      .style("transform", "rotate(270deg)")
      .style("text-anchor", "middle");

    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(uniqueMonths.map((month) => new Date(2023, month, 1)))
      .tickFormat((date) => {
        const formatMonth = d3.timeFormat("%b");
        return formatMonth(date);
      });

    container
      .append("g")
      .classed("xAxis", true)
      .style("transform", `translateY(${dimensions.containerHeight}px)`)
      .call(xAxis);

    // Tooltip
    container
      .append("rect")
      .classed("mouse-tracker", true)
      .attr("width", dimensions.containerWidth)
      .attr("height", dimensions.containerHeight)
      .style("opacity", 0)
      .on("touchmouse mousemove", function (event) {
        const mousePos = d3.pointer(event, this);

        // x coordinate stored in mousePos index 0
        const date = xScale.invert(mousePos[0]);

        // Custom Bisector - left, center, right
        const dateBisector = d3.bisector(xAccessor).center;

        const bisectionIndex = dateBisector(parsedData, date);
        //console.log(bisectionIndex);
        // math.max prevents negative index reference error
        const hoveredIndexData = parsedData[Math.max(0, bisectionIndex)];

        // Update Image
        tooltipDot
          .style("opacity", 1)
          .attr("cx", xScale(xAccessor(hoveredIndexData)))
          .attr("cy", yScale(yAccessor(hoveredIndexData)))
          .raise();

        tooltip
          .style("display", "block")
          .style("top", `${yScale(yAccessor(hoveredIndexData)) + 50}px`)
          .style("left", `${xScale(xAccessor(hoveredIndexData)) + 50}px`);

        tooltip.select(".data").text(`Value: ${yAccessor(hoveredIndexData)}`);

        const dateFormatter = d3.timeFormat("%B %-d, %Y");

        tooltip
          .select(".date")
          .text(`${dateFormatter(xAccessor(hoveredIndexData))}`);
      })
      .on("mouseleave", function () {
        tooltipDot.style("opacity", 0);
        tooltip.style("display", "none");
      });
  }, [parsedData, height, width]);

  return (
    parsedData && (
      <div className="py-5 ">
        <Container className="d-flex justify-content-center graphContainer">
          <Card className="p-4 d-flex flex-column align-items-center ">
            <h2>{title}</h2>
            <div ref={svgContainer} className="line-chart">
              <svg ref={svgRef} />
              <div ref={tooltipRef} className="lc-tooltip">
                <div className="data"></div>
                <div className="date"></div>
              </div>
            </div>
            <div className="d-flex">
              <Button
                onClick={handleAddData}
                variant="success"
                className="me-3"
              >
                Add Data
              </Button>
              <Button onClick={handleDeleteData} variant="danger">
                Delete Data
              </Button>
            </div>
          </Card>
        </Container>
      </div>
    )
  );
};

export default AreaGraph;
