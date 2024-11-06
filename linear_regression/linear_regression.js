d3.csv('linear_regression/linear_regression_data.csv').then(data => {
    const x = data.map(d => +d.x_value);
    const y = data.map(d => +d.y_value);
    
    const lr = new simpleLinearRegression(x, y);
    
    const svg = d3.select('#linear-regression-visualization')
                  .append('svg')
                  .attr('width', 600)
                  .attr('height', 400);

    const xScale = d3.scaleLinear().domain([d3.min(x), d3.max(x)]).range([0, 580]);
    const yScale = d3.scaleLinear().domain([d3.min(y), d3.max(y)]).range([380, 0]);

    svg.selectAll('circle')
       .data(data)
       .enter()
       .append('circle')
       .attr('cx', d => xScale(d.x_value))
       .attr('cy', d => yScale(d.y_value))
       .attr('r', 5)
       .attr('fill', 'blue');

       const line = d3.line()
                   .x(d => xScale(d.x))
                   .y(d => yScale(lr.predict(d.x)));
    
    svg.append('path')
       .datum([{ x: d3.min(x), y: lr.predict(d3.min(x)) }, { x: d3.max(x), y: lr.predict(d3.max(x)) }])
       .attr('d', line)
       .attr('stroke', 'red')
       .attr('stroke-width', 2)
       .attr('fill', 'none');
});
