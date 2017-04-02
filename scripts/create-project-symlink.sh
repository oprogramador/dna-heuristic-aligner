#!/bin/bash
set -e

cd `dirname $(which $0)`
cd ..

path=node_modules/dna-heuristic-aligner
mkdir -p node_modules
rm -f $path
ln -s ../src $path
