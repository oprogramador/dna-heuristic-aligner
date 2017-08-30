#!/bin/bash
set -e

cd `dirname $(which $0)`
cd ..
cd $DNA_DATA_DIR

lengths=(
  10
  20
  50
  100
  200
  500
  1000
  2000
  5000
  10000
  20000
  50000
  100000
  200000
  500000
  1000000
)

for file in ftp____*.fa
do
  for length in "${lengths[@]}"
  do
    cat $file | head -n $length > ${length}__${file}
  done
done
