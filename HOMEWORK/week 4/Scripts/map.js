/*
Homework week 4
Chris Ras
10689958
*/

// Datamap code adapted from http://bl.ocks.org/markmarkoh/4127667

window.onload = function() {
	// load data
	d3.json("../week%204/Data/h1n1_data.json", function(dataset) {

		// initiate map
		$("#container").datamap({
			scope: 'world',
			geography_config: {
			    borderColor: 'rgba(255,255,255,0.3)',
			    highlightBorderColor: 'rgba(0,0,0,0.5)',
			    // what is shown when hovering on a country
			    popupTemplate: _.template([
			    	'<div class="hoverinfo">',
			    	'<strong><%= geography.properties.name %></strong><br/>',
			    	'<% if (data.cases) { %> <%= data.cases %><br/><% } %>',
			    	'</div>'
			    ].join('') )
			},
			// colors for countries
			fills: {
				very_high: '#ff0000',
				high: '#ff6600',
				moderate: '#ffcc66',
				low: '#ffff99',
				defaultFill: '#c2c2d6' 
			},
			data: parseData(dataset)
		})
	})
}

// function that parses the data from the json into a format accepted by Datamaps
function parseData(data) {
	newData = {}
	for(var i = 0; i < data.length; i++) {
		country = data[i]
		casesString = "Number of cases: " + country["cases"] + ", reported deaths: " + country["deaths"]
		newData[country["code"]] = {
			fillKey: getFillKey(country["cases"]),
			cases: casesString
		}
	}
	return newData
}

// given an amount of h1n1 cases, returns appropriate color category
function getFillKey(numberOfCases) {
	if(numberOfCases < 1000) {
		return "low"
	} else if(numberOfCases >= 1000 && numberOfCases < 10000) {
		return "moderate"
	} else if(numberOfCases >= 10000 && numberOfCases < 100000) {
		return "high"
	} else {
		return "very_high"
	}
}




