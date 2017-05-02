import _ from 'lodash';
import fs from 'fs';
import parseFNA from 'fna-parser';

const fna = fs.readFileSync(`${__dirname}/tests/data/example.fna`).toString();
const chromosomes = parseFNA(fna).filter(item => item.chromosome === 'X');

const [first, second] = chromosomes;
const sequences = [];

_.times(3000, () => {
  let sequenceLength = 20;
  const start = _.random(first.sequence.length - sequenceLength);
  let sequence;
  do {
    sequence = first.sequence.substr(start, sequenceLength);
    sequenceLength++;
  } while (second.sequence.search(sequence) >= 0);
  sequence = sequence.slice(0, -1);
  const position = second.sequence.search(sequence);
  if (position >= 0) {
    sequences.push({ position, sequence, start });
  }
});

// eslint-disable-next-line no-console
console.log(sequences);
