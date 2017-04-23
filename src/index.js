import fs from 'fs';
import parseFNA from 'fna-parser';

const fna = fs.readFileSync(`${__dirname}/tests/data/example.fna`).toString();
const data = parseFNA(fna);

// eslint-disable-next-line no-console
console.log(data);
