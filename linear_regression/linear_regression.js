document.addEventListener("DOMContentLoaded", () => {
   d3.csv('linear_regression/linear_regression_data.csv').then(data => {
       data = data.map(d => ({
           'Human Development Index (value)': +d['Human Development Index (value)'],
           'Expected Years of Schooling (years)': +d['Expected Years of Schooling (years)'],
           'Mean Years of Schooling (years)': +d['Mean Years of Schooling (years)'],
           'Gross National Income Per Capita (2017 PPP$)': +d['Gross National Income Per Capita (2017 PPP$)'],
           'Life Expectancy at Birth (years)': +d['Life Expectancy at Birth (years)'],
           'Predicted HDI': +d['Predicted_HDI'],
           'country': d['Country']
       }));
       const features = [
           'Expected Years of Schooling (years)',
           'Mean Years of Schooling (years)',
           'Gross National Income Per Capita (2017 PPP$)',
           'Life Expectancy at Birth (years)'
       ];
       const coefficients = [
        { feature: 'Expected Years of Schooling', coefficient: 0.071249 },
        { feature: 'Mean Years of Schooling', coefficient: 0.158265 },
        { feature: 'Gross National Income Per Capita', coefficient: 0.022089 },
        { feature: 'Life Expectancy at Birth', coefficient: -0.001379 }
    ];    
       createScatterPlotMatrix(features, data);
       createActualVsPredictedPlot(data);
   }).catch(error => {
       console.error('Error loading the CSV file:', error);
   });

   function createScatterPlotMatrix(features, data) {
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 500, height = 500;
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "lightgrey")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("visibility", "hidden");

    d3.select('#scatter-plot')
        .style('display', 'grid')
        .style('grid-template-columns', 'repeat(2, 1fr)')
        .style('grid-gap', '20px');

    features.forEach((feature, index) => {
        const plotContainer = d3.select('#scatter-plot')
            .append('div')
            .attr('class', 'plot');
        const svg = plotContainer.append('svg')
            .attr('width', width)
            .attr('height', height);
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[feature])])
            .range([margin.left, width - margin.right]);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d['Human Development Index (value)'])])
            .range([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale));
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - margin.bottom / 2 + 20)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text(feature);

        svg.append("text")
            .attr("x", -height / 2)
            .attr("y", margin.left / 3)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Human Development Index (value)");

        const colorScale = d3.scaleSequential(d3.interpolateViridis)
            .domain([0, d3.max(data, d => d['Human Development Index (value)'])]);

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d[feature]))
            .attr("cy", d => yScale(d['Human Development Index (value)']))
            .attr("r", 5)
            .attr("fill", d => colorScale(d['Human Development Index (value)']))
            .attr("opacity", 0.7)
            .on("mouseover", (event, d) => {
                tooltip.style("visibility", "visible")
                    .html(`Country: ${d.country}<br>${feature}: ${d[feature]}<br>HDI: ${d['Human Development Index (value)']}`);
            })
            .on("mousemove", (event) => {
                tooltip.style("top", (event.pageY + 5) + "px")
                    .style("left", (event.pageX + 5) + "px");
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden");
            });

        // Color Legend based on your example
        const legendHeight = 20, legendWidth = 200;
        const legend = plotContainer.append('div')
            .attr('class', 'legend')
            .style('width', `${legendWidth}px`)
            .style('height', `${legendHeight}px`)
            .style('margin', '20px 0');

        const colorLegendScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, legendWidth]);

        const colorLegendAxis = d3.axisBottom(colorLegendScale)
            .ticks(5)
            .tickSize(10);

        const legendSvg = legend.append('svg')
            .attr('width', legendWidth)
            .attr('height', legendHeight);

        legendSvg.selectAll('rect')
            .data(d3.range(0, 1.01, 0.01))
            .enter()
            .append('rect')
            .attr('x', d => colorLegendScale(d))
            .attr('y', 0)
            .attr('width', legendWidth / 100)
            .attr('height', legendHeight)
            .attr('fill', d => colorScale(d));

        const hdiRange = colorLegendScale.domain();

        legend.append('p')
            .text(`Color represents HDI value from ${hdiRange[0].toFixed(2)} to ${hdiRange[1].toFixed(2)}`)
            .style('text-align', 'center')
            .style('font-size', '12px');
    });
}


function createActualVsPredictedPlot(data) {
    const margin = { top: 40, right: 20, bottom: 50, left: 70 };
    const width = 500, height = 500;
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "lightgrey")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("visibility", "hidden");

    const svg = d3.select('#predicted-vs-actual-plot')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d['Human Development Index (value)'])])
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d['Predicted HDI'])])
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom / 2 + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Human Development Index (value)");

    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", margin.left / 3)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Predicted HDI");

    // Calculate the absolute difference between actual and predicted HDI
    const maxDiff = d3.max(data, d => Math.abs(d['Human Development Index (value)'] - d['Predicted HDI']));

    // Color scale based on the absolute difference
    const colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
        .domain([0, maxDiff]); // Range from 0 (smallest difference) to the max difference

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d['Human Development Index (value)']))
        .attr("cy", d => yScale(d['Predicted HDI']))
        .attr("r", 5)
        .attr("fill", d => colorScale(Math.abs(d['Human Development Index (value)'] - d['Predicted HDI'])))
        .attr("opacity", 0.7)
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible")
                .html(`Country: ${d.country}<br>Actual HDI: ${d['Human Development Index (value)']}<br>Predicted HDI: ${d['Predicted HDI']}<br>Difference: ${Math.abs(d['Human Development Index (value)'] - d['Predicted HDI'])}`);
        })
        .on("mousemove", (event) => {
            tooltip.style("top", (event.pageY + 5) + "px")
                .style("left", (event.pageX + 5) + "px");
        })
        .on("mouseout", () => {
            tooltip.style("visibility", "hidden");
        });

    const xMean = d3.mean(data, d => d['Human Development Index (value)']);
    const yMean = d3.mean(data, d => d['Predicted HDI']);
    const numerator = d3.sum(data, d => (d['Human Development Index (value)'] - xMean) * (d['Predicted HDI'] - yMean));
    const denominator = d3.sum(data, d => (d['Human Development Index (value)'] - xMean) ** 2);
    const slope = numerator / denominator;
    const intercept = yMean - slope * xMean;

    const line = d3.line()
        .x(d => xScale(d['Human Development Index (value)']))
        .y(d => yScale(slope * d['Human Development Index (value)'] + intercept));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", line);

    const midpointX = (xScale.domain()[0] + xScale.domain()[1]) / 2;
    const midpointY = slope * midpointX + intercept;
    svg.append("text")
        .attr("x", xScale(midpointX)-150)
        .attr("y", yScale(midpointY) +160)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "red")
        .text(`y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`);

    const legendHeight = 20, legendWidth = 200;
    const legend = d3.select('#predicted-vs-actual-plot')
        .append('div')
        .attr('class', 'legend')
        .style('width', `${legendWidth}px`)
        .style('height', `${legendHeight}px`)
        .style('margin', '20px 0');

    const colorLegendScale = d3.scaleLinear()
        .domain([0, maxDiff])
        .range([0, legendWidth]);

    const colorLegendAxis = d3.axisBottom(colorLegendScale)
        .ticks(5)
        .tickSize(10);

    const legendSvg = legend.append('svg')
        .attr('width', legendWidth)
        .attr('height', legendHeight);

    legendSvg.selectAll('rect')
        .data(d3.range(0, 1.01, 0.01))
        .enter()
        .append('rect')
        .attr('x', d => colorLegendScale(d))
        .attr('y', 0)
        .attr('width', legendWidth / 100)
        .attr('height', legendHeight)
        .attr('fill', d => colorScale(d));

    const hdiRange = colorLegendScale.domain();

    legend.append('p')
        .text(`Color represents the absolute difference between Actual and Predicted HDI values`)
        .style('text-align', 'center')
        .style('font-size', '12px');
}
 });
