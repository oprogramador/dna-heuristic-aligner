#!/bin/bash
set -e

cd `dirname $(which $0)`
cd ..
cd data

for file in *.fa
do
  makeblastdb -in $file -parse_seqids -dbtype nucl
done
