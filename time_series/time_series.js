document.addEventListener("DOMContentLoaded", () => {
    d3.csv('time_series/time_series_data.csv').then(data => {
        data = data.map(d => ({
            'Country': d['Country'],
            'Year': +d['Year'],
            'HDI_Score': +d['HDI_Score'],
            'Predicted_HDI_Score': +d['Predicted_HDI_Score']
        }));

        const dataByCountry = d3.group(data, d => d.Country);

        const defaultCountry = 'Singapore';
        const countries = Array.from(dataByCountry.keys());

        const countrySelect = d3.select('#country-select')
            .append('select')
            .attr('id', 'country-dropdown')
            .attr('class', 'block w-1/3 mx-auto p-2 border border-gray-300 rounded')
            .on('change', function() {
                const selectedCountry = this.value;
                updatePlots(selectedCountry);
            });

        countrySelect
            .selectAll('option')
            .data(countries)
            .enter()
            .append('option')
            .attr('value', d => d)
            .text(d => d);

        countrySelect.property('value', defaultCountry);
        updatePlots(defaultCountry);

        function updatePlots(selectedCountry) {
            d3.select('#time-series-plots').html('');
            const countryData = dataByCountry.get(selectedCountry);
            createTimeSeriesPlot(countryData, selectedCountry);
        }

        function createTimeSeriesPlot(data, country) {
            const margin = { top: 40, right: 20, bottom: 50, left: 70 };
            const width = 1000, height = 500;
            
            const svgContainer = d3.select('#time-series-plots')
                .style('display', 'flex')
                .style('justify-content', 'center')
                .style('align-items', 'center')
                .style('height', '70vh')
                .append('svg')
                .attr('width', width)
                .attr('height', height);
            
            const xScale = d3.scaleLinear()
                .domain(d3.extent(data, d => d['Year']))
                .range([margin.left, width - margin.right]);
        
            const yScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => Math.max(d['HDI_Score'], d['Predicted_HDI_Score']))])
                .range([height - margin.bottom, margin.top]);
        
            svgContainer.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
                .attr('class', 'text-sm text-gray-600');
        
            svgContainer.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(yScale))
                .attr('class', 'text-sm text-gray-600');
        
            svgContainer.append("text")
                .attr("x", width / 2)
                .attr("y", height - margin.bottom + 35)
                .attr("text-anchor", "middle")
                .attr("class", "text-sm text-gray-700")
                .text("Year");
        
            svgContainer.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", margin.left - 40)
                .attr("text-anchor", "middle")
                .attr("class", "text-sm text-gray-700")
                .text("HDI Score");
        
            svgContainer.append("text")
                .attr("x", width / 2)
                .attr("y", margin.top / 2)
                .attr("text-anchor", "middle")
                .attr("class", "text-lg font-semibold text-gray-800")
                .text(country);
        
            const actualData = data.filter(d => d['Year'] <= 2022);
            svgContainer.append("path")
                .datum(actualData)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2)
                .attr("d", d3.line()
                    .x(d => xScale(d['Year']))
                    .y(d => yScale(d['HDI_Score']))
                );
        
            const predictedData = data.filter(d => d['Year'] >= 2023);
            svgContainer.append("path")
                .datum(predictedData)
                .attr("fill", "none")
                .attr("stroke", "orange")
                .attr("stroke-dasharray", "4")
                .attr("stroke-width", 2)
                .attr("d", d3.line()
                    .x(d => xScale(d['Year']))
                    .y(d => yScale(d['Predicted_HDI_Score']))
                );
        
            const legend = svgContainer.append("g")
                .attr("transform", `translate(${width - 150}, ${height - margin.bottom - 50})`);                   
        
            legend.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", "steelblue");
        
            legend.append("text")
                .attr("x", 15)
                .attr("y", 10)
                .text("Actual HDI Score")
                .attr("class", "text-sm text-gray-700")
                .attr("alignment-baseline", "middle");
        
            legend.append("rect")
                .attr("x", 0)
                .attr("y", 20)
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", "orange");
        
            legend.append("text")
                .attr("x", 15)
                .attr("y", 30)
                .text("Predicted HDI Score")
                .attr("class", "text-sm text-gray-700")
                .attr("alignment-baseline", "middle");
        }
                    }).catch(error => {
        console.error('Error loading the CSV file:', error);
    });
});
