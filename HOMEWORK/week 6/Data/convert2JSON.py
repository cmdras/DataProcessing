'''
Homework week 6
Chris Ras
10689958
'''

import csv
import json

happinessIndexCSV = open('happinessIndex.csv', 'r')
happinessIndexJSON = open('happinessIndex.json', 'w')
qualityOfLifeCSV = open('qualityOfLife.csv', 'r')
qualityOfLifeJSON = open('qualityOfLife.json', 'w')

happinessIndexFieldnames = ["Country","Code","Happiness Index","Happiness Ranking"]
qualityOfLifeFieldnames = ["Code","Country","Quality of Life Index","Purchasing Power Index",
						   "Safety Index","Health Care Index","Cost of Living Index",
						   "Property Price to Income Ratio", "Traffic Commute Time Index"]
csvFiles = [happinessIndexCSV, qualityOfLifeCSV]
jsonFiles = [happinessIndexJSON, qualityOfLifeJSON]
fieldnames = [happinessIndexFieldnames, qualityOfLifeFieldnames]

for jsonIndex in range(len(jsonFiles)):
	jsonFiles[jsonIndex].write("[\n")
	reader = csv.DictReader(csvFiles[jsonIndex], fieldnames[jsonIndex])
	rows = []

	for row in reader:
		rows.append(row)

	for row in rows[:-1]:
		json.dump(row, jsonFiles[jsonIndex])
		jsonFiles[jsonIndex].write(",\n")
	json.dump(rows[-1], jsonFiles[jsonIndex])

	jsonFiles[jsonIndex].write("\n]")