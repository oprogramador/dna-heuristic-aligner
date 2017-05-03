import findSimilarGenes from 'dna-heuristic-aligner/findSimilarGenes';
import fs from 'fs';
import parseFNA from 'fna-parser';
import sumSequencesLength from 'dna-heuristic-aligner/measurers/sumSequencesLength';

const fna = fs.readFileSync(`${__dirname}/tests/data/example.fna`).toString();
const chromosomes = parseFNA(fna).filter(item => item.chromosome === 'X');

const [first, second] = chromosomes;
const sequences = findSimilarGenes(first, second, { maxTimes: 20000 });

/* eslint-disable no-console */
console.log(`Sequences length sum: ${sumSequencesLength(sequences)}`);
console.log(sequences);
