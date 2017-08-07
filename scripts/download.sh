#!/bin/bash
set -e

url=$1
dir=$DNA_DATA_DIR
mkdir -p $dir
cd $dir

function createPath() {
  sed 's/\//__/g' | sed 's/://g'
}

function cutExtension() {
  sed 's/\.gz//g'
}

firstPath=`echo $url | createPath`
firstFinalPath=`echo $firstPath | cutExtension`

if [ ! -f $firstFinalPath ]; then
  curl -o $firstPath $url
  gunzip $firstPath
fi
echo saved as `realpath $firstFinalPath`
