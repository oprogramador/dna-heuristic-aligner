import findExactGenes from 'dna-heuristic-aligner/findExactGenes';
import fs from 'fs';
import groupClosestSequences from 'dna-heuristic-aligner/groupClosestSequences';
import parseFNA from 'fna-parser';
import sumSequencesLength from 'dna-heuristic-aligner/measurers/sumSequencesLength';

const first = parseFNA(fs.readFileSync(`${__dirname}/../data/hs_alt_CHM1_1.1_chr1.fa`).toString())[0];
const second = parseFNA(fs.readFileSync(`${__dirname}/../data/9595_ref_gorGor4_chr1.fa`).toString())[0];

const sequences = findExactGenes(first, second, { maxTimes: 200 });
const groupedSequences = groupClosestSequences(first.sequence, second.sequence, sequences, 1000);

/* eslint-disable no-console */
console.log(`Sequences length sum: ${sumSequencesLength(sequences)}`);
console.log(groupedSequences);
