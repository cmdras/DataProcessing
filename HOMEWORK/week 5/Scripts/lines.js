/*
Homework week 5
Chris Ras
10689958
*/

// Most code adapted from https://bl.ocks.org/mbostock/3884955
// Mouseover code adapted from https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91 and https://bl.ocks.org/mbostock/3902569
// Tooltip code: http://bl.ocks.org/biovisualize/1016860
// Dropdown menu code: https://www.w3schools.com/howto/howto_js_dropdown.asp
// Cleaning SVG code adapted from: http://stackoverflow.com/questions/10784018/how-can-i-remove-or-replace-svg-content

window.onload = function() {
	// Global variables
	var margin
	var height
	var width

	startup()
}

// Show dropdown contents
function buttonPressed() {
	document.getElementById("myDropdown").classList.toggle("show");
}

// Starts the graph up based on the dropdown selection
function startup() {
	d3.selectAll(".m")
		.on("click", function() {
			var filename
			var year = this.getAttribute("value")

			if (year === "2015") {
				filename = "../week%205/Data/deBilt2015.json"
			} else if (year === "2016") {
				filename = "../week%205/Data/deBilt2016.json"
			}
			document.getElementById("myDropdown").classList.toggle("show")
			var svg = cleanSvg()
			drawLines(svg, filename)
		})
}

// Cleans any content of the SVG element and returns a clean one
function cleanSvg() {
	var svg = d3.select("svg")
	svg.selectAll("*").remove()
	return svg
}

// Draw line graph
function drawLines(svg, filename) {
	margin = {top: 20, right: 80, bottom: 30, left: 50}
	width = +svg.attr("width") - margin.left - margin.right
	height = +svg.attr("height") - margin.top - margin.bottom
	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0)
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")

	var x = d3.scaleTime().rangeRound([0, width])
	var y = d3.scaleLinear().rangeRound([height, 0])
	var z = d3.scaleOrdinal(d3.schemeCategory10)

	var line = d3.line()
		.curve(d3.curveBasis)
		.x(function(d) { return x(d.date) })
		.y(function(d) { return y(d.temperature) })

	d3.json(filename, function(error, dataset) {
		// Error handling
		if (error) {
			alert("Error in loading data")
		}

		dataset = parseDataset(dataset)
		// Create pre defined column names (They aren't in the json)
		dataset.columns = ["date", "max", "avg", "min"]

		// Data handling
		var temperatures = dataset.columns.slice(1).map(function(type) {
			return {
				id: type,
				values: dataset.map(function(d) {
					return {
						date: d.date,
						temperature: d[type]
					}
				})
			}
		})

		// Set domain
		x.domain(d3.extent(dataset, function(d) { return d.date }));
		y.domain([
			d3.min(temperatures, function(c) {
				return d3.min(c.values, function(d) {
					return d.temperature
				})
			}),
			d3.max(temperatures, function(c) {
				return d3.max(c.values, function(d) {
					return d.temperature
				})
			})
		])
		z.domain(temperatures.map(function(c) { return c.id }))

		// Graph handling
		g.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x))
		g.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(y))
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", "0.71em")
				.attr("fill", "#000")
				.text("Temperature in ºC")

		// Create the different lines for the temperatures
		var tempData = g.selectAll(".temperature")
			.data(temperatures)
			.enter().append("g")
			.attr("class", "temperature")
		// Draw the lines
		tempData.append("path")
			.attr("class", "line")
			.attr("d", function(d) {
				return line(d.values)
			})
			.style("stroke", function(d) { return z(d.id) })
			.style("fill", "none")
		// Add text on the graph
		tempData.append("text")
			.datum(function(d) { return { id: d.id, value: d.values[d.values.length - 1] } })
			.attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")" })
			.attr("x", 3)
			.attr("dy", "0.35em")
			.style("font", "10px sans-serif")
			.text(function(d) { return d.id })

		// INTERACTIVITY
		// Focus line indicates what date is hovered on
		var focus = tempData.append("g")
			.attr("class", "focus")
			.style("display", "none")
		focus.append('line')
			.attr('class', 'focusLine')

		var bisectDate = d3.bisector(function(d) { return d.date; }).left

		// Make overlay on which the focus line will move
		g.append('rect')
			.attr('class', 'overlay')
			.attr('width', width)
			.attr('height', height)
			// Mouse events
			.on('mouseover', function() { 
				focus.style('display', null); 
				tooltip.style("visibility", "visible")
				tooltip.transition()
					.style("opacity", 1)
			})
			.on('mouseout', function() { 
				focus.style('display', 'none')
				tooltip.style("visibility", "hidden")
				tooltip.transition()
					.style("opacity", 0)
			})
			.on('mousemove', function() { 
				var mouse = d3.mouse(this)
				var mouseDate = x.invert(mouse[0])
				// Get the exact date index which is being hovered
				var i = bisectDate(dataset, mouseDate)

				// xValue is the hovered on date, y
				var xValue = x(dataset[i].date)

				// Draw the focus line, which is only a vertical line, moving on the x-axis
				focus.select('.focusLine')
					.attr('x1', xValue).attr('y1', height)
					.attr('x2', xValue).attr('y2', 0);
				
				updateTooltipData(i, mouse, tooltip, dataset)
			})
	})
}

// Turn strings from json into integers, use the actual temperatures
function parseDataset(dataset) {
	parseTime = d3.timeParse("%Y%m%d")
	dataset.forEach(function(d) {
		d.max = +d.max / 10
		d.avg = +d.avg / 10
		d.min = +d.min / 10
		d.date = parseTime(d.date)
	})
	return dataset
}

// Update the tooltip box contents
function updateTooltipData(i, mouse, tooltip, dataset) {
	// Show tooltip box	
	tooltip.transition()		
		.duration(1)		
		.style("opacity", 1)		
	
	// tooltip text
	tooltip.html(
		"<strong>" + String(dataset[i].date).substring(4, 16) + "</strong></br>" +
		"<p>" +"Max Temperature: " + (dataset[i].max  + " ºC</p>") +
		"<p>" +"Average Temperature: " + (dataset[i].avg  + " ºC</p>") +
		"<p>" +"Minimum Temperature: " + (dataset[i].min  + " ºC</p>")
		)
		.style("left", mouse[0] + margin.left + 50 + "px")		
		.style("top", mouse[1] + "px");
}