import { useEffect } from "react";
import {
  select,
  csv,
  scaleLinear,
  max,
  scaleBand,
  axisLeft,
  axisBottom,
} from "d3";

function App() {
  useEffect(() => {
    const url =
      "https://gist.githubusercontent.com/himchan94/beb23e1ce7ff00472739cb659a323df2/raw/6d57522c450dfdb2a61ba2343825f2ef283ea604/population.csv";
    const svg = select("svg");
    const width = svg.attr("width");
    const height = svg.attr("height");

    const render = (data) => {
      const xValue = (d) => d.population;
      const yValue = (d) => d.country;
      const margin = { top: 20, right: 40, bottom: 20, left: 100 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const xScale = scaleLinear()
        .domain([0, max(data, (d) => xValue(d))])
        .range([0, innerWidth]);

      const yScale = scaleBand()
        .domain(data.map((d) => yValue(d)))
        .range([0, innerHeight])
        .padding(0.1);

      // const yAxis = axisLeft(yScale);
      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      g.append("g").call(axisLeft(yScale));
      g.append("g")
        .call(axisBottom(xScale))
        .attr("transform", `translate(0,${innerHeight})`);

      g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", (d) => yScale(yValue(d)))
        .attr("width", (d) => xScale(xValue(d)))
        .attr("height", yScale.bandwidth());
    };

    csv(url).then((data) => {
      data.forEach((d) => {
        d.population = +d.population * 1000;
      });
      render(data);
    });
  }, []);

  return <svg width="960" height="500"></svg>;
}

export default App;
