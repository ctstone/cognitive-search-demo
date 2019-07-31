#! /usr/bin/env bash
# curl https://datasets.imdbws.com/name.basics.tsv.gz --output name.basics.tsv.gz
curl https://datasets.imdbws.com/title.basics.tsv.gz --output title.basics.tsv.gz
# curl https://datasets.imdbws.com/title.principals.tsv.gz --output title.principals.tsv.gz
# curl https://datasets.imdbws.com/title.ratings.tsv.gz --output title.ratings.tsv.gz
# curl https://datasets.imdbws.com/title.akas.tsv.gz --output title.akas.tsv.gz 
# curl https://datasets.imdbws.com/title.crew.tsv.gz --output title.crew.tsv.gz
gunzip *.gz