import _ from 'lodash';
import expect from 'dna-heuristic-aligner/tests/expect';
import findExactGenes from 'dna-heuristic-aligner/findExactGenes';
import fs from 'fs';
import parseFASTA from 'fasta-to-object-parser';

const generateFakeIntegerFunction = () => {
  let i = 0;

  const generate = () => {
    i++;

    return i;
  };

  return generate;
};

describe('findExactGenes', () => {
  it('returns at least one value', () => {
    const fna = fs.readFileSync(`${__dirname}/../data/example.fna`).toString();
    const chromosomes = parseFASTA(fna).filter(item => item.chromosome === 'X');
    const [first, second] = chromosomes;

    const result = findExactGenes(
      first.sequence,
      second.sequence,
      {
        generateRandomInteger: generateFakeIntegerFunction(),
        maxTimes: 1000,
      }
    );

    expect(_.values(result)).to.have.length.at.least(1);
  });

  it('returns repetitions', () => {
    const fna = fs.readFileSync(`${__dirname}/../data/example.fna`).toString();
    const chromosomes = parseFASTA(fna).filter(item => item.chromosome === 'X');
    const [first, second] = chromosomes;

    const result = findExactGenes(
      first.sequence,
      second.sequence,
      {
        generateRandomInteger: generateFakeIntegerFunction(),
        maxTimes: 1000,
      }
    );

    _.values(result).map((value) => {
      expect(first.sequence.substr(value.positionAtFirst, value.sequence.length)).to.equal(value.sequence);
      expect(second.sequence.substr(value.positionAtSecond, value.sequence.length)).to.equal(value.sequence);

      return null;
    });
  });

  it('returns keys equal to positions', () => {
    const fna = fs.readFileSync(`${__dirname}/../data/example.fna`).toString();
    const chromosomes = parseFASTA(fna).filter(item => item.chromosome === 'X');
    const [first, second] = chromosomes;

    const result = findExactGenes(
      first.sequence,
      second.sequence,
      {
        generateRandomInteger: generateFakeIntegerFunction(),
        maxTimes: 1000,
      }
    );

    _.map(result, (value, key) =>
      expect(key).to.equal(value.positionAtFirst.toString())
    );
  });
});
