import _ from 'lodash';
import expect from 'dna-heuristic-aligner/tests/expect';
import findSimilarGenes from 'dna-heuristic-aligner/findSimilarGenes';
import fs from 'fs';
import parseFNA from 'fna-parser';

describe('findSimilarGenes', () => {
  it('returns at least one value', () => {
    const fna = fs.readFileSync(`${__dirname}/../data/example.fna`).toString();
    const chromosomes = parseFNA(fna).filter(item => item.chromosome === 'X');
    const [first, second] = chromosomes;

    const result = findSimilarGenes(first, second);

    expect(_.values(result)).to.have.length.at.least(1);
  });
});
