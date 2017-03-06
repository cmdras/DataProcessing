'''
Homework week 5
Chris Ras
10689958
'''

import csv
import json

csvfile2015 = open('deBilt2015.csv', 'r')
jsonfile2015 = open('deBilt2015.json', 'w')
csvfile2016 = open('deBilt2016.csv', 'r')
jsonfile2016 = open('deBilt2016.json', 'w')

# both files are put in an array
# prevents duplicate code
csvFiles = [csvfile2015, csvfile2016]
jsonFiles = [jsonfile2015, jsonfile2016]
fieldnames = ["date", "avg", "min", "max"]

# write to each json file
for jsonIndex in range(len(jsonFiles)):
	jsonFiles[jsonIndex].write("[\n")
	reader = csv.DictReader(csvFiles[jsonIndex], fieldnames)
	rows = []

	for row in reader:
		rows.append(row)

	for row in rows[:-1]:
		json.dump(row, jsonFiles[jsonIndex])
		jsonFiles[jsonIndex].write(",\n")
	json.dump(rows[-1], jsonFiles[jsonIndex])

	jsonFiles[jsonIndex].write("\n]")