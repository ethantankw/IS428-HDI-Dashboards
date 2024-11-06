
d3.csv('time_series/time_series_data.csv').then(data => {
    const parseDate = d3.timeParse("%Y-%m-%d");
    
    data.forEach(d => {
        d.date = parseDate(d.date);
        d.hdi = +d.hdi;
    });

    const svg = d3.select('#time-series-visualization')
                  .append('svg')
                  .attr('width', 600)
                  .attr('height', 400);
    
    const xScale = d3.scaleTime()
                     .domain(d3.extent(data, d => d.date))
                     .range([0, 580]);
    
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d.hdi)])
                     .range([380, 0]);

    const line = d3.line()
                   .x(d => xScale(d.date))
                   .y(d => yScale(d.hdi));
    
    svg.append('path')
       .datum(data)
       .attr('d', line)
       .attr('stroke', 'green')
       .attr('stroke-width', 2)
       .attr('fill', 'none');
    
    svg.selectAll('circle')
       .data(data)
       .enter()
       .append('circle')
       .attr('cx', d => xScale(d.date))
       .attr('cy', d => yScale(d.hdi))
       .attr('r', 3)
       .attr('fill', 'black');
});
