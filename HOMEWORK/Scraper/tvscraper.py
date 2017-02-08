#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Name: Chris Ras
# Student number: 10689958
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM, plaintext

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''
    series = []
    for i in range(50):
        serie = []
        actors_list = []

        # get and append title
        title = dom.by_class("lister-item-header")[i].by_tag("a")[0].content
        serie.append(plaintext(title + " "))

        # get and append rating
        rating = dom.by_class("ratings-imdb-rating")[i].by_tag("strong")[0].content
        serie.append(rating)

        # get and append genre
        genre = dom.by_class("genre")[i].content
        serie.append(plaintext(genre))

        # get and append actors
        actors = dom.by_class("lister-item-content")[i].by_tag("p")[2].by_tag("a")
        for actor in actors:
            actors_list.append(plaintext(actor.content))
        serie.append(', '.join(actors_list))
        # get and append runtime
        runtime = dom.by_class("runtime")[i+1].content
        serie.append(runtime[:-4])

        # append the serie to list of series
        series.append(serie)
    return series


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
    for serie in tvseries:
        serie = [s.encode('utf-8') for s in serie]
        writer.writerow(serie)

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
