
/*
Homework week 6
Chris Ras
10689958
*/
// Code adapted from https://github.com/markmarkoh/datamaps/blob/master/README.md#getting-started 
// and https://github.com/markmarkoh/datamaps/blob/master/src/examples/highmaps_world.html
// Scatter plot code adapted from http://bl.ocks.org/bunkat/2595950
window.onload = function() {
	// Queue the 2 datasets
	d3.queue()
		.defer(d3.json, "../week%206/Data/happinessIndex.json")
		.defer(d3.json, "../week%206/Data/qualityOfLife.json")
		.await(drawMap)
}

// Function that draws a chloropleth
function drawMap(error, indexDataset, qualityDataset) {
	// Add map title
	d3.select("#mapTitle").append("text")
		.attr("text-anchor", "middle")
		.style("font-size", "16px")
		.style("text-decoration", "underline")
		.text("Happiness Index Per Country (2016)")

	qualityDataset = parseQualityOfLife(qualityDataset)

	// Get palette scale for the colours on the chloropleth
	var dataRange = getColorPalette(indexDataset)
	var paletteScale = d3.scale.linear()
		.domain(dataRange)
		.range(["#fee6ce", "#e6550d"])

	happinessData = parseHappinessData(indexDataset, paletteScale)

	// Draw the map
	var map = new Datamap({
		element: document.getElementById('container'),
		fills: {
			defaultFill: '#F5F5F5',
			"High Happiness Index": '#e6550d',
			"Low Happiness Index": "#fee6ce"
		},
		data: happinessData,
		geographyConfig: {
			popupTemplate: function(geo, data) {
				return ['<div class="hoverinfo"><strong>',
					geo.properties.name + '</strong><br/>',
					data.happinessIndexString,
					'</strong></div>'
				].join('')
			}
		},
		// Handle clicking on country
		done: function(datamap) {
			datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
				window.scrollTo(0, 500)
				singleCountry(happinessData, qualityDataset, geography.id)
			})
		}
	})
	map.legend()
	// Draw initial scatter plot
	makeScatterPlot(happinessData, qualityDataset)
	resetButton(happinessData, qualityDataset)
}

// Parses the happiness index dataset for use
function parseHappinessData(dataset, paletteScale) {
	newData = {}
	for (var i = 0; i < dataset.length; i++) {
		var country = dataset[i]
		var indexValue = country["Happiness Index"],
			ranking = country["Happiness Ranking"]

		indexString = "Happiness Index: " + indexValue + ", Global ranking: " + ranking
		newData[country["Code"]] = {
			fillColor: paletteScale(country["Happiness Index"]),
			happinessIndexString: indexString,
			happinessIndex: indexValue,
			countryName: country["Country"]
		}
	}
	return newData
}

// Returns the minimum and maximum value to be used to assign the color palette
function getColorPalette(dataset) {
	var onlyValues = dataset.map(function(obj) {
		return obj["Happiness Index"]
	})
	var minValue = Math.min.apply(null, onlyValues)
	var maxValue = Math.max.apply(null, onlyValues)
	return [minValue, maxValue]
}

// Make a scatter plot with the given datasets
function makeScatterPlot(happinessData, qualityDataset) {
	// Tooltip creation
	var tooltip = d3.select("#scatter").append("div")
		.attr("class", "tooltip")

	// Prepare dataset
	var combinedData = getScatterData(happinessData, qualityDataset)

	// Prepare scatter plot
	var margin = {
			top: 20,
			right: 15,
			bottom: 60,
			left: 60
		},
		width = 600 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom

	var x = d3.scale.linear()
		.domain([0, d3.max(combinedData, function(d) {
			return parseFloat(d["qualityOfLife"])
		})])
		.range([0, width])

	var y = d3.scale.linear()
		.domain([0, d3.max(combinedData, function(d) {
			return parseFloat(d["happinessIndex"])
		})])
		.range([height, 0])

	var chart = d3.select('#scatter')
		.append('svg:svg')
		.attr("id", "scatterPlot")

	chart = clearScatterPlot()
	chart.append("text")
		.attr("text-anchor", "left")
		.style("font-size", "16px")
		.style("text-decoration", "underline")
		.text("Happiness Index (2016) vs Quality of Life Index (2017)")

	chart
		.attr('width', width + margin.right + margin.left)
		.attr('height', height + margin.top + margin.bottom)
		.attr('class', 'chart')
		.style('padding-top', "35")

	var main = chart.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('width', width)
		.attr('height', height)
		.attr('class', 'main')

	// Draw the axes
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient('bottom')

	main.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.attr('class', 'main axis date')
		.call(xAxis)
		.append("text")
		.attr("y", -20)
		.attr("x", 350)
		.attr("dy", "0.71em")
		.attr("fill", "#000")
		.text("Quality Of Life Score")

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient('left')

	main.append('g')
		.attr('transform', 'translate(0,0)')
		.attr('class', 'main axis date')
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(90)")
		.attr("x", "-10")
		.attr("y", "30")
		.attr("dy", "0.71em")
		.attr("fill", "#000")
		.text("Happiness Index Score")

	var g = main.append("svg:g")

	// Draw the dots
	g.selectAll("scatter-dots")
		.data(combinedData)
		.enter().append("svg:circle")
		.attr("cx", function(d, i) {
			return x(d["qualityOfLife"])
		})
		.attr("cy", function(d) {
			return y(d["happinessIndex"])
		})
		.attr("r", 8)
		.attr("fill", "#e6550d")
		// Tooltip on mouseover
		.on('mouseover', function(d) {
			tooltip.html("<strong>" + d["name"] + "</strong><br/>" +
				"Quality of Life Score: " + d["qualityOfLife"] + "<br/>" +
				"Happiness Index: " + d["happinessIndex"]
			)
			tooltip.style("visibility", "visible")
			tooltip.transition()
				.style("opacity", 1)
				.style("left", (d3.event.pageX + 30) + "px")
				.style("top", (d3.event.pageY - 30) + "px")
		})
		.on('mouseout', function() {
			tooltip.transition()
			tooltip.style("visibility", "hidden")
			tooltip.transition()
				.style("opacity", 0)
		})

}

// Function that parses the Quality of Life dataset
function parseQualityOfLife(dataset) {
	var parsedDict = {}
	for (var i = 0; i < dataset.length; i++) {
		var country = dataset[i]
		var chunkedDict = {
			Country: country["Country"],
			QualityOfLife: country["Quality of Life Index"]
		}
		parsedDict[country["Code"]] = chunkedDict
	}
	return parsedDict
}

// Function that prepares the data to be used in the scatterplot
function getScatterData(happinessData, qualityDataset) {
	var data = []
	for (var key in happinessData) {
		var happinessIndexValue = happinessData[key]["happinessIndex"]
		if (qualityDataset.hasOwnProperty(key)) {
			var chunk = {
				code: key,
				happinessIndex: parseFloat(happinessIndexValue),
				qualityOfLife: parseFloat(qualityDataset[key]["QualityOfLife"]),
				name: happinessData[key]["countryName"]
			}
			data.push(chunk)
		}
	}
	return data
}

// Clears the scatter plot and returns an empty one for reuse
function clearScatterPlot() {
	var plot = d3.select("#scatterPlot")
	plot.selectAll("*").remove()
	return plot
}

// Make a scatter plot for a single country
function singleCountry(happinessData, qualityDataset, code) {
	if (happinessData.hasOwnProperty(code) && qualityDataset.hasOwnProperty(code)) {
		var newHappinessData = {}
		var newQualityData = {}
		newHappinessData[code] = happinessData[code]
		newQualityData[code] = qualityDataset[code]

		makeScatterPlot(newHappinessData, newQualityData)
	} else {
		alert("Sorry, not all data of the selected country is found. Please try another country.")
	}
}

// Button that resets the scatter plot to its original state on press
function resetButton(happinessData, qualityDataset) {
	d3.select("#buttonDiv")
		.append("div")
		.attr("id", "option")
	d3.select("#option")
		.append("input")
		.attr("class", "btn btn-info btn-sm")
		.attr("id", "button")
		.attr("name", "updateButton")
		.attr("type", "button")
		.attr("value", "Reset Scatterplot")

	document.getElementById("button").addEventListener("click", function() {
		makeScatterPlot(happinessData, qualityDataset)
	}, false)
}