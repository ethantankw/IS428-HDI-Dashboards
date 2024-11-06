document.addEventListener("DOMContentLoaded", () => {
   d3.csv('linear_regression/linear_regression_data.csv').then(data => {
       data = data.map(d => ({
           country: d['Country'],
           'Human Development Index (value)': +d['Human Development Index (value)'],
           'Expected Years of Schooling (years)': +d['Expected Years of Schooling (years)'],
           'Mean Years of Schooling (years)': +d['Mean Years of Schooling (years)'],
           'Gross National Income Per Capita (2017 PPP$)': +d['Gross National Income Per Capita (2017 PPP$)'],
           'Life Expectancy at Birth (years)': +d['Life Expectancy at Birth (years)'],
           'Predicted HDI': +d['Predicted_HDI']
       }));

       const features = [
           'Expected Years of Schooling (years)',
           'Mean Years of Schooling (years)',
           'Gross National Income Per Capita (2017 PPP$)',
           'Life Expectancy at Birth (years)'
       ];

       createScatterPlotMatrix(features, data);

       createActualVsPredictedPlot(data);

   }).catch(error => {
       console.error('Error loading the CSV file:', error);
   });

   function createScatterPlotMatrix(features, data) {
       const margin = { top: 40, right: 20, bottom: 50, left: 70 };
       const width = 500, height = 400;
       const padding = 40; 

       const container = d3.select('#scatter-plot')
           .style('display', 'grid')
           .style('grid-template-columns', 'repeat(2, 1fr)')
           .style('grid-gap', `${padding}px`);

       const tooltip = d3.select('body').append('div')
           .attr('class', 'tooltip')
           .style('position', 'absolute')
           .style('visibility', 'hidden')
           .style('background-color', 'rgba(0,0,0,0.7)')
           .style('color', 'white')
           .style('padding', '5px')
           .style('border-radius', '5px')
           .style('font-size', '12px')
           .style('pointer-events', 'none');

       const colorScale = d3.scaleSequential(d3.interpolateBlues)
           .domain([d3.min(data, d => d['Human Development Index (value)']), d3.max(data, d => d['Human Development Index (value)'])]);

       features.forEach((feature, i) => {
           const svg = container.append('svg')
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

           svg.selectAll("circle")
               .data(data)
               .enter()
               .append("circle")
               .attr("cx", d => xScale(d[feature]))
               .attr("cy", d => yScale(d['Human Development Index (value)']))
               .attr("r", 5)
               .attr("fill", d => colorScale(d['Human Development Index (value)'])) // Color based on HDI
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
       });
   }

   function createActualVsPredictedPlot(data) {
      const margin = { top: 40, right: 20, bottom: 50, left: 70 };
      const width = 500, height = 500;
  
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
  
      const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('visibility', 'hidden')
          .style('background-color', 'rgba(0,0,0,0.7)')
          .style('color', 'white')
          .style('padding', '5px')
          .style('border-radius', '5px')
          .style('font-size', '12px')
          .style('pointer-events', 'none');
  
      svg.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", d => xScale(d['Human Development Index (value)']))
          .attr("cy", d => yScale(d['Predicted HDI']))
          .attr("r", 5)
          .attr("fill", "green")
          .attr("opacity", 0.6)
          .on("mouseover", (event, d) => {
              tooltip.style("visibility", "visible")
                  .html(`Actual HDI: ${d['Human Development Index (value)']}<br>Predicted HDI: ${d['Predicted HDI']}<br>Country: ${d.country}`);
          })
          .on("mousemove", (event) => {
              tooltip.style("top", (event.pageY + 5) + "px")
                  .style("left", (event.pageX + 5) + "px");
          })
          .on("mouseout", () => {
              tooltip.style("visibility", "hidden");
          });
  
      svg.append("line")
          .attr("x1", xScale(0))
          .attr("y1", yScale(0))
          .attr("x2", xScale(d3.max(data, d => d['Human Development Index (value)'])))
          .attr("y2", yScale(d3.max(data, d => d['Human Development Index (value)'])))
          .attr("stroke", "red")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "4");
  }
});
