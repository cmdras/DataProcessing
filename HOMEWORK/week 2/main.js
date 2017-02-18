/*
Homework week 2
Chris Ras
10689958
*/

// variables to be used throughout the code
var numberOfMonths = 12;
var numberOfDays
var transform;
var padding;
var domainBounds


// get the temperature data
var request = new XMLHttpRequest();
request.open("GET", "data_cleaned.txt", false)
request.send();
var requestText = request.responseText;
var data = requestText.split('\n');
var dates = new Array();
var temperatures = new Array();
var dataLength = data.length;
numberOfDays = dataLength - 2;


// i starts at 1 to skip initial line
for (var i = 1; i < dataLength - 1; i++) {
	var value = data[i].split(',');
	var parsedDate = parseDate(value[0].trim())
	var date = new Date(parsedDate)
	dates.push(date)
	temperatures.push(value[1].trim())
}


// create canvas
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
configureCanvas();
addDataToCanvas();



// function makes the string from the data compatible with the Date function
function parseDate(dateString) {
	var newDate = dateString.substring(0,4) + "-" + dateString.substring(4,6) + "-" + dateString.substring(6,8)
	return newDate
}

// function that creates datapoints based on the temperatures
function createTransform(domain, range){
    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}

// finds the minimum and maximum temperatures of the dataset
function findDomain(temperatures) {
	var min = 0;
	var max = 0
	for(var i=0; i < temperatures.length; i++) {
		if (parseInt(temperatures[i]) < min) {
			min = parseInt(temperatures[i])
		} else if (parseInt(temperatures[i]) > max) {
			max = parseInt(temperatures[i])
		}
	}
	return [min, max]
}

// function that configures the look of the graph.
// changes to appearance should be made here
function configureCanvas() {
	ctx.fillText("Average Temperature in De Bilt in 2016", 180, 20)

	// padding for the graph inside the canvas
	padding = 20;

	// define the axis labels
	domainBounds = findDomain(temperatures)
	var xAxisLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	var yAxisLabels = temperatureRange(domainBounds)
	
	// configure label scales
	var xLabelSpacing =  (c.width - padding ) / numberOfMonths;
	var yLabelSpacing =  (c.height - padding) / yAxisLabels.length;

	// draw the graph container, along with the axes
	ctx.strokeStyle= "black";
	ctx.beginPath();
	ctx.moveTo(padding, 0);
	ctx.lineTo(padding, c.height - padding);
	ctx.stroke();
	ctx.moveTo(padding, c.height - padding);
	ctx.lineTo(c.width, c.height - padding);
	ctx.stroke();
	for (i = 0; i <= numberOfMonths; i++){
	    ctx.fillText(xAxisLabels[i], (i + 1) * xLabelSpacing - 10, c.height - 10);
	}
	for (i = 0; i <= yAxisLabels.length - 1; i++){
	    ctx.fillText(yAxisLabels[i], 5, i * yLabelSpacing + padding);
	}
}

// creates the graph based on the datapoints
function addDataToCanvas(){
	// spacing of the datapoints
	var xValueSpacing = c.width / numberOfDays;

	// get datapoints for temperatures
	var range = [padding, numberOfDays + padding]
	transform = createTransform(domainBounds, range);

	ctx.strokeStyle= "blue";
	ctx.beginPath();
	for (var i = 1; i < dataLength - 1; i++) {
		ctx.lineTo(i * xValueSpacing + padding, c.height - padding - transform(temperatures[i]));
	}
	ctx.stroke();
}

// returns an array of temperatures that should be used for the y-axis labels
function temperatureRange(bounds){
	var difference = bounds[1] - bounds[0]
	var steps = difference / 10
	var range = new Array;
	for(var i = bounds[1]; i >= bounds[0]; i = i - steps){
		range.push(Math.round(parseInt(i)/10))
	}
	return range
}