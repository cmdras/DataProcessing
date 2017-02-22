import csv
import json

csvfile = open('etmaalsom2015debilt.csv', 'r')
jsonfile = open('etmaalsom2015debilt.json', 'w')

fieldnames = ["Datum", "Neerslag"]
reader = csv.DictReader(csvfile, fieldnames)

# write to json file
for row in reader:
	json.dump(row, jsonfile)
	jsonfile.write("\n")