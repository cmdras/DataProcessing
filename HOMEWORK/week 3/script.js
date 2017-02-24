/*
Homework week 3
Chris Ras
10689958
*/

/*
Bug: the month labels are not showing below on the x-axis. I think it
has something to do with how I'm loading in the data. 

I figured out (very late) that I should have parsed the data in the Python
file instead of parsing it here. convertCSV2JSON.py only converts the dataset
into a JSON file, while I should have parsed it completely there. Good learning
moment. 
*/

// based on d3 tutorials on https://bost.ocks.org/mike/bar/3/
// tooltip code: http://bl.ocks.org/biovisualize/1016860
// round code from http://www.jacklmoore.com/notes/rounding-in-javascript/

// margin
var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var monthLenghts = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

// tooltip shows text when hovering on a bar
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("z-index", "10")
	.style("visibility", "hidden")
    
// set the scales and axes
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1)

var y = d3.scale.linear()
    .range([height, 0])

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

// create the chart
var chart = d3.select(".chart")
    .attr("width", width).attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// read the json file
d3.json("etmaalsom2015debilt.json", function(error,data) {
	// parse data
	avgData = combineData(data)
	newDataDict = createDataDict(months, avgData)

	// set domain
	x.domain(newDataDict.map(function(d) { 
		return d.month }))
	y.domain([0, d3.max(newDataDict, function(d) { return d.value })])

  // set x-axis
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

  // set y-axis
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "begin")
    .text("Rainfall in mm")
   
  // create bars for each value in dataset
  chart.selectAll(".bar")
   	.data(newDataDict)
   	.enter().append("rect")
   	.attr("class", "bar")
   	.attr("x", function(d) { return x(d.month) })
   	.attr("y", function(d) { 
   		// in the dataset there are negative values, which realistically is impossible
   		// this bypasses that
   		if (y(d.value) <= 0) {
   			return 0
   		} else {
   			return y(d.value)
   		}
   	})
   	.attr("height",  function(d) {
   		// bypass the negative values in dataset
   		if (y(d.value) <= 0) {
   			return height
   		} else {
   			return height - y(d.value)
   		}
   	})
   	.attr("width", x.rangeBand())
   	// tooltip functionality
   	.on("mouseover", function(d) {
   		tooltip.style("visibility", "visible")
   		tooltip.transition()
        .style("opacity", 1)
        tooltip.html(d.month + " 2015" + "<br>" + "Average rainfall: " + d.value + " mm" )
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 10) + "px")
   	})
	.on("mouseout", function(d) {
            tooltip.transition()
             .style("opacity", 0)
        })
})

// dataset is given per day, this averages the values over months
function combineData(data) {
	var x = 0
	var monthlyData = []
	for (var length = 0; length < monthLenghts.length; length++) {
		var sumOfRain = 0
		for (var i = x; i-x < monthLenghts[length]; i++) {
			sumOfRain += parseInt(data[i].Neerslag / 10)
		}
		monthlyData.push(round(sumOfRain/monthLenghts[length], 1))
		x += monthLenghts[length]
	}
	console.log(monthlyData)
	return monthlyData
}

// creates a new dictionary based on the months and average rainfall
function createDataDict(monthArray, dataArray) {
	var newDict = []
	for (var i = 0; i < monthArray.length; i++) {
		newDict.push({month: monthArray[i], value: dataArray[i]})
	}

	return newDict
}

// function that rounds the rainfall to specified decimals
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals)
}
