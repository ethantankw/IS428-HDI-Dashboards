document.addEventListener("DOMContentLoaded", () => {
    d3.csv('clustering/clustering_data.csv').then(data => {
        data.forEach(d => {
            d['Human Development Index (value)'] = +d['Human Development Index (value)'];
            d['Life Expectancy at Birth (years)'] = +d['Life Expectancy at Birth (years)'];
            d['Total Affected'] = +d['Total Affected'];
        });

        const width = 800, height = 500, margin = { top: 50, right: 30, bottom: 50, left: 50 };

        createClusteringGraph(data, width, height, margin);
        createRegionGraph(data, width, height, margin);
        createIncomeGroupGraph(data, width, height, margin);
    })
    .catch(error => {
        console.error('Error loading the CSV file:', error);
    });
});

function createClusteringGraph(data, width, height, margin) {
    const svg = d3.select('#clustering-visualization')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    const xScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d['Human Development Index (value)'])])
                     .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d['Life Expectancy at Birth (years)'])])
                     .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const sizeScale = d3.scaleSqrt()
                        .domain([0, d3.max(data, d => d['Total Affected'])])
                        .range([2, 20]);

    svg.append("g")
       .attr("transform", `translate(0,${height - margin.bottom})`)
       .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(".2f")))
       .append("text")
       .attr("x", width - margin.right)
       .attr("y", -10)
       .attr("text-anchor", "end")
       .attr("fill", "black")
       .text("Human Development Index (HDI)");

    svg.append("g")
       .attr("transform", `translate(${margin.left},10)`)
       .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".2f")))
       .append("text")
       .attr("x", 150)
       .attr("y", margin.top)
       .attr("text-anchor", "end")
       .attr("fill", "black")
       .text("Life Expectancy at Birth (years)");

    const tooltip = d3.select("body")
                      .append("div")
                      .style("position", "absolute")
                      .style("visibility", "hidden")
                      .style("background", "lightgray")
                      .style("padding", "8px")
                      .style("border-radius", "4px");

    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", d => xScale(d['Human Development Index (value)']))
       .attr("cy", d => yScale(d['Life Expectancy at Birth (years)']))
       .attr("r", d => sizeScale(d['Total Affected']))
       .attr("fill", d => colorScale(d['Cluster']))
       .attr("opacity", 0.7)
       .on("mouseover", (event, d) => {
           tooltip.style("visibility", "visible")
                  .html(`
                      <strong>Country:</strong> ${d.Country}<br>
                      <strong>HDI:</strong> ${d['Human Development Index (value)']}<br>
                      <strong>Life Expectancy:</strong> ${d['Life Expectancy at Birth (years)']}<br>
                      <strong>Total Affected:</strong> ${d['Total Affected']}<br>
                      <strong>Cluster:</strong> ${d['Cluster']}
                  `);
       })
       .on("mousemove", (event) => {
           tooltip.style("top", (event.pageY - 10) + "px")
                  .style("left", (event.pageX + 10) + "px");
       })
       .on("mouseout", () => {
           tooltip.style("visibility", "hidden");
       });

    const clusters = Array.from(new Set(data.map(d => d['Cluster'])));
    const legendCenterX = width - margin.right - 50;

    svg.append("text")
       .attr("class", "legend-title")
       .attr("x", legendCenterX) 
       .attr("y", height - margin.bottom - (clusters.length * 32) - 40)
       .attr("text-anchor", "middle")
       .attr("font-weight", "bold")
       .text("Cluster Number");

    const legend = svg.selectAll(".legend")
       .data(clusters)
       .enter()
       .append("g")
       .attr("class", "legend")
       .attr("transform", (d, i) => `translate(${legendCenterX},${height - margin.bottom - (clusters.length - i) * 40})`);

    legend.append("rect")
          .attr("x", -9)
          .attr("width", 18)
          .attr("height", 18)
          .attr("fill", d => colorScale(d));

    legend.append("text")
          .attr("x", -12)
          .attr("y", 9)
          .attr("dy", "0.35em")
          .attr("text-anchor", "end")
          .text(d => d);
}

function createRegionGraph(data, width, height, margin) {
        const svg = d3.select('#clustering-visualization')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    const xScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d['Human Development Index (value)'])])
                     .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d['Life Expectancy at Birth (years)'])])
                     .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const sizeScale = d3.scaleSqrt()
                        .domain([0, d3.max(data, d => d['Total Affected'])])
                        .range([2, 20]);

    svg.append("g")
       .attr("transform", `translate(0,${height - margin.bottom})`)
       .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(".2f")))
       .append("text")
       .attr("x", width - margin.right)
       .attr("y", -10)
       .attr("text-anchor", "end")
       .attr("fill", "black")
       .text("Human Development Index (HDI)");

    svg.append("g")
       .attr("transform", `translate(${margin.left},10)`)
       .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".2f")))
       .append("text")
       .attr("x", 150)
       .attr("y", margin.top)
       .attr("text-anchor", "end")
       .attr("fill", "black")
       .text("Life Expectancy at Birth (years)");

    const tooltip = d3.select("body")
                      .append("div")
                      .style("position", "absolute")
                      .style("visibility", "hidden")
                      .style("background", "lightgray")
                      .style("padding", "8px")
                      .style("border-radius", "4px");

    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", d => xScale(d['Human Development Index (value)']))
       .attr("cy", d => yScale(d['Life Expectancy at Birth (years)']))
       .attr("r", d => sizeScale(d['Total Affected']))
       .attr("fill", d => colorScale(d['Cluster']))
       .attr("opacity", 0.7)
       .on("mouseover", (event, d) => {
           tooltip.style("visibility", "visible")
                  .html(`
                      <strong>Region:</strong> ${d.Region}<br>
                      <strong>HDI:</strong> ${d['Human Development Index (value)']}<br>
                      <strong>Life Expectancy:</strong> ${d['Life Expectancy at Birth (years)']}<br>
                      <strong>Total Affected:</strong> ${d['Total Affected']}<br>
                      <strong>Cluster:</strong> ${d['Cluster']}
                  `);
       })
       .on("mousemove", (event) => {
           tooltip.style("top", (event.pageY - 10) + "px")
                  .style("left", (event.pageX + 10) + "px");
       })
       .on("mouseout", () => {
           tooltip.style("visibility", "hidden");
       });

    const clusters = Array.from(new Set(data.map(d => d['Cluster'])));
    const legendCenterX = width - margin.right - 50;

    svg.append("text")
       .attr("class", "legend-title")
       .attr("x", legendCenterX) 
       .attr("y", height - margin.bottom - (clusters.length * 32) - 40)
       .attr("text-anchor", "middle")
       .attr("font-weight", "bold")
       .text("Cluster Number");

    const legend = svg.selectAll(".legend")
       .data(clusters)
       .enter()
       .append("g")
       .attr("class", "legend")
       .attr("transform", (d, i) => `translate(${legendCenterX},${height - margin.bottom - (clusters.length - i) * 40})`);

    legend.append("rect")
          .attr("x", -9)
          .attr("width", 18)
          .attr("height", 18)
          .attr("fill", d => colorScale(d));

    legend.append("text")
          .attr("x", -12)
          .attr("y", 9)
          .attr("dy", "0.35em")
          .attr("text-anchor", "end")
          .text(d => d);

}

function createIncomeGroupGraph(data, width, height, margin) {
        const svg = d3.select('#clustering-visualization')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    const xScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d['Human Development Index (value)'])])
                     .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d['Life Expectancy at Birth (years)'])])
                     .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const sizeScale = d3.scaleSqrt()
                        .domain([0, d3.max(data, d => d['Total Affected'])])
                        .range([2, 20]);

    svg.append("g")
       .attr("transform", `translate(0,${height - margin.bottom})`)
       .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(".2f")))
       .append("text")
       .attr("x", width - margin.right)
       .attr("y", -10)
       .attr("text-anchor", "end")
       .attr("fill", "black")
       .text("Human Development Index (HDI)");

    svg.append("g")
       .attr("transform", `translate(${margin.left},10)`)
       .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".2f")))
       .append("text")
       .attr("x", 150)
       .attr("y", margin.top)
       .attr("text-anchor", "end")
       .attr("fill", "black")
       .text("Life Expectancy at Birth (years)");

    const tooltip = d3.select("body")
                      .append("div")
                      .style("position", "absolute")
                      .style("visibility", "hidden")
                      .style("background", "lightgray")
                      .style("padding", "8px")
                      .style("border-radius", "4px");

    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", d => xScale(d['Human Development Index (value)']))
       .attr("cy", d => yScale(d['Life Expectancy at Birth (years)']))
       .attr("r", d => sizeScale(d['Total Affected']))
       .attr("fill", d => colorScale(d['Cluster']))
       .attr("opacity", 0.7)
       .on("mouseover", (event, d) => {
           tooltip.style("visibility", "visible")
                  .html(`
                      <strong>Income Group:</strong> ${d.IncomeGroup}<br>
                      <strong>HDI:</strong> ${d['Human Development Index (value)']}<br>
                      <strong>Life Expectancy:</strong> ${d['Life Expectancy at Birth (years)']}<br>
                      <strong>Total Affected:</strong> ${d['Total Affected']}<br>
                      <strong>Cluster:</strong> ${d['Cluster']}
                  `);
       })
       .on("mousemove", (event) => {
           tooltip.style("top", (event.pageY - 10) + "px")
                  .style("left", (event.pageX + 10) + "px");
       })
       .on("mouseout", () => {
           tooltip.style("visibility", "hidden");
       });

    const clusters = Array.from(new Set(data.map(d => d['Cluster'])));
    const legendCenterX = width - margin.right - 50;

    svg.append("text")
       .attr("class", "legend-title")
       .attr("x", legendCenterX) 
       .attr("y", height - margin.bottom - (clusters.length * 32) - 40)
       .attr("text-anchor", "middle")
       .attr("font-weight", "bold")
       .text("Cluster Number");

    const legend = svg.selectAll(".legend")
       .data(clusters)
       .enter()
       .append("g")
       .attr("class", "legend")
       .attr("transform", (d, i) => `translate(${legendCenterX},${height - margin.bottom - (clusters.length - i) * 40})`);

    legend.append("rect")
          .attr("x", -9)
          .attr("width", 18)
          .attr("height", 18)
          .attr("fill", d => colorScale(d));

    legend.append("text")
          .attr("x", -12)
          .attr("y", 9)
          .attr("dy", "0.35em")
          .attr("text-anchor", "end")
          .text(d => d);
}
