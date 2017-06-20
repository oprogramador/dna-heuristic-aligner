import expect from 'dna-heuristic-aligner/tests/expect';
import sinon from 'sinon';
import sumSimilarity from 'dna-heuristic-aligner/measurers/sumSimilarity';

describe('sumSimilarity', () => {
  it('sums similarities', () => {
    const geneA1 = 'CTACAGTCTGCCGGGGTACTGGCT';
    const geneA2 = 'CTACAGTCTGCCGGGTACTGGCT';
    const geneB1 = 'GACCCGAACCGAAACTCA';
    const geneB2 = 'GACCCGAACCGAACTCA';

    const data = {
      152: {
        positionAtFirst: 152,
        positionAtSecond: 189,
        sequenceAtFirst: geneA1,
        sequenceAtSecond: geneA2,
      },
      219: {
        positionAtFirst: 219,
        positionAtSecond: 345,
        sequenceAtFirst: geneB1,
        sequenceAtSecond: geneB2,
      },
    };

    const getSimilarity = sinon.stub();
    getSimilarity.withArgs(geneA1, geneA2).returns(0.5);
    getSimilarity.withArgs(geneB1, geneB2).returns(0.3);

    expect(sumSimilarity(data, getSimilarity)).to.equal(0.8);
  });
});
