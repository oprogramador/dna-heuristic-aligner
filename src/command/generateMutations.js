import fs from 'fs';
import generateMutations from 'dna-heuristic-aligner/generation/generateMutations';
import parseFASTA from 'fasta-to-object-parser';
import process from 'process';

const sequenceName = process.argv[2];
const count = process.argv[3];

const sequence = parseFASTA(fs.readFileSync(sequenceName).toString())[0].sequence;
const newSequence = generateMutations(sequence, count);

// eslint-disable-next-line no-console
console.log(newSequence);
