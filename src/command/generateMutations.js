import parseFASTA, { writeFASTA } from 'fasta-to-object-parser';
import fs from 'fs';
import generateMutations from 'dna-heuristic-aligner/generation/generateMutations';
import process from 'process';

const sequenceName = process.argv[2];
const count = process.argv[3];

const mutated = writeFASTA(
  parseFASTA(fs.readFileSync(sequenceName).toString())
    .map(dna => Object.assign({}, dna, { sequence: generateMutations(dna.sequence, count) }))
);

// eslint-disable-next-line no-console
console.log(mutated);
