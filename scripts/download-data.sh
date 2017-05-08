#!/bin/bash
set -e

cd data

curl -O ftp://ftp.ncbi.nlm.nih.gov/genomes/Gorilla_gorilla/CHR_01/9595_ref_gorGor4_chr1.fa.gz
curl -O ftp://ftp.ncbi.nlm.nih.gov/genomes/Homo_sapiens/CHR_01/hs_alt_CHM1_1.1_chr1.fa.gz

gunzip *.gz
