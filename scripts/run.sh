#!/bin/bash
set -e

dir=data
mkdir -p $dir
cd $dir

function createPath() {
  sed 's/\//__/g' | sed 's/://g'
}

function cutExtension() {
  sed 's/\.gz//g'
}

strategy=$3
firstPath=`echo $1 | createPath`
secondPath=`echo $2 | createPath`
firstFinalPath=`echo $firstPath | cutExtension`
secondFinalPath=`echo $secondPath | cutExtension`

if [ ! -f $firstFinalPath ]; then
  curl -o $firstPath $1
  gunzip $firstPath
fi

if [ ! -f $secondFinalPath ]; then
  curl -o $secondPath $2
  gunzip $secondPath
fi

npm start -- $1 $2 $firstFinalPath $secondFinalPath $strategy
