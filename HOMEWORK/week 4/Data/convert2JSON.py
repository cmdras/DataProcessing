'''
Homework week 4
Chris Ras
10689958
'''

import csv
import json

countries = []
csvfile = open('h1n1_data.csv', 'r')
jsonfile = open('h1n1_data.json', 'w')

fieldnames = ["country", "code","cases", "deaths"]
reader = csv.DictReader(csvfile, fieldnames)

for row in reader:
	countries.append(row)

jsonfile.write("[")

for country in countries[:-1]:
	json.dump(country, jsonfile)
	jsonfile.write(",\n")

json.dump(countries[-1], jsonfile)
jsonfile.write("\n]")