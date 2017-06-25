#!/bin/bash
set -e

cd `dirname $(which $0)`
cd ..
cd data

lengths=(
  10
  20
  50
  100
  200
  500
  1000
)

for file in ftp____*.fa
do
  for length in "${lengths[@]}"
  do
    cat $file | head -n $length > ${length}__${file}
  done
done
