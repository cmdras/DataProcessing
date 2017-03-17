/*
Homework week 6
Chris Ras
10689958
*/

// Code adapted from https://github.com/markmarkoh/datamaps/blob/master/README.md#getting-started 
// and https://github.com/markmarkoh/datamaps/blob/master/src/examples/highmaps_world.html

// Scatterplot = TODO


window.onload = function() {
	

	d3.queue()
	.defer(d3.json, "../week%206/Data/happinessIndex.json")
	.defer(d3.json, "../week%206/Data/qualityOfLife.json")
	.await(drawMap)
}

function drawMap(error, indexDataset, qualityDataset) {
			var dataRange = getColorPallete(indexDataset)
		var palleteScale = d3.scale.linear()
            .domain(dataRange)
            .range(["#fee6ce","#e6550d"]);

		var map = new Datamap({element: document.getElementById('container'),
			fills: {
				defaultFill: '#F5F5F5'
			},
			data: parseData(indexDataset, palleteScale),
			geographyConfig: {
	            popupTemplate: function(geo, data) {
	                return ['<div class="hoverinfo"><strong>',
	                        geo.properties.name + '</strong><br/>',
	                        data.happinessIndex,
	                        '</strong></div>'].join('');
	            }
	        },
	        done: function(datamap) {
	            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
	                //alert(geography.id);
	                makeBarChart(qualityDataset, geography.id)
	            });
	        }
		});
		map.legend()
}

function parseData(dataset, palleteScale) {
	newData = {}
	for(var i = 0; i < dataset.length; i++) {
		var country = dataset[i]
		var indexValue = country["Happiness Index"],
			ranking = country["Happiness Ranking"]
		
		indexString = "Happiness Index: " + indexValue + ", Global ranking: " + ranking
		newData[country["Code"]] = {
			fillColor: palleteScale(country["Happiness Index"]),
			happinessIndex: indexString
		}
	}
	return newData
}

function getColorPallete(dataset) {
	var onlyValues = dataset.map(function(obj){ return obj["Happiness Index"]; });
	var minValue = Math.min.apply(null, onlyValues)
	var maxValue = Math.max.apply(null, onlyValues)
	return [minValue, maxValue]
}

function makeBarChart(dataset, code) {
	for(var i = 0; i < dataset.length; i++) {
		var country = dataset[i]
		if(country["Code"] == code) {
			alert(country["Health Care Index"])
		}
	}
}
