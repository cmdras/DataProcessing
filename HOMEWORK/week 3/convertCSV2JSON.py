'''
Homework week 3
Chris Ras
10689958
'''


import csv
import json

csvfile = open('etmaalsom2015debilt.csv', 'r')
jsonfile = open('etmaalsom2015debilt.json', 'w')

fieldnames = ["Datum", "Neerslag"]
reader = csv.DictReader(csvfile, fieldnames)

# write to json file
jsonfile.write("[")
rows = []

for row in reader:
	rows.append(row)

for row in rows[:-1]:
	json.dump(row, jsonfile)
	jsonfile.write(",\n")
json.dump(rows[-1], jsonfile)

jsonfile.write("\n]")