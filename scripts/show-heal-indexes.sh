#!/bin/bash

npm run read-from-database --silent -- $1 allMutationsIndexesAtFirstSequence | ./node_modules/.bin/jsonlint | grep -o '[0-9]*' | uniq
