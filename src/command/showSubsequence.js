import fs from 'fs';
import parseFASTA from 'fasta-to-object-parser';

const sequencePath = process.argv[2];
const begin = process.argv[3];
const end = process.argv[4];
const dataDir = process.env.DNA_DATA_DIR;

const { sequence } = parseFASTA(fs.readFileSync(`${dataDir}/${sequencePath}`).toString())[0];

// eslint-disable-next-line no-console
console.log(sequence.substring(begin, end));
