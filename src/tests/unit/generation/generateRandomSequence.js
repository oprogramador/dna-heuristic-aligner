import _ from 'lodash';
import expect from 'dna-heuristic-aligner/tests/expect';
import generateRandomSequence from 'dna-heuristic-aligner/generation/generateRandomSequence';

describe('generateRandomSequence', () => {
  it('generates random DNA sequence of given length', () => {
    const length = 24;
    const result = generateRandomSequence(length);

    expect(result).to.be.a('string');
    expect(result).to.have.length(length);

    _.map(result, character => expect('ACGT').to.contain(character));
  });
});
