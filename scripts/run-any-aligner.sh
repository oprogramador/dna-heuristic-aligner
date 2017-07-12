#!/bin/bash
set -e

cd `dirname $(which $0)`
cd ..

dataDir=$DNA_DATA_DIR

first=$1
second=$2
aligner=$3

if [ "$aligner" == 'blast' ]
then
  blastn -db $dataDir/$second -query $dataDir/$first
elif [ "$aligner" == 'blat' ]
then
  blat $dataDir/$second $dataDir/$first $dataDir/output.psl
elif [ "$aligner" == 'heal' ]
then
  npm start -- $first $second $first $second findMutationsWithOnlyExtending
fi
