#!/bin/bash

cat $DNA_DATA_DIR/output.psl |  awk '{print $20}' | grep ',' | sed 's/,/\n/g' | sort -n | uniq
