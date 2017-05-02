import findSimilarGenes from 'dna-heuristic-aligner/findSimilarGenes';
import fs from 'fs';
import parseFNA from 'fna-parser';

const fna = fs.readFileSync(`${__dirname}/tests/data/example.fna`).toString();
const chromosomes = parseFNA(fna).filter(item => item.chromosome === 'X');

const [first, second] = chromosomes;
const sequences = findSimilarGenes(first, second);

// eslint-disable-next-line no-console
console.log(sequences);
