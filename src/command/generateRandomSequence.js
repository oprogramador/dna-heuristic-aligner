import generateRandomSequence from 'dna-heuristic-aligner/generation/generateRandomSequence';
import process from 'process';

const length = process.argv[2];
const sequence = generateRandomSequence(length);

// eslint-disable-next-line no-console
console.log(sequence);
