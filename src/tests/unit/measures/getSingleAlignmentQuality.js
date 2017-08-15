import expect from 'dna-heuristic-aligner/tests/expect';
import getSingleAlignmentQuality from 'dna-heuristic-aligner/measurers/getSingleAlignmentQuality';
import sinon from 'sinon';

describe('getSingleAlignmentQuality', () => {
  it('returns product of the similarity power two and the length for subsequences of the same length', () => {
    const geneA1 = 'CTA';
    const geneA2 = 'CTG';

    const getSimilarity = sinon.stub();
    getSimilarity.withArgs(geneA1, geneA2).returns(0.2);

    expect(getSingleAlignmentQuality(geneA1, geneA2, getSimilarity)).to.be.closeTo(0.12, 0.00001);
  });

  it('returns product of the similarity power two and the minumum length for subsequences of different length', () => {
    const geneA1 = 'CTAGGC';
    const geneA2 = 'CTGAG';

    const getSimilarity = sinon.stub();
    getSimilarity.withArgs(geneA1, geneA2).returns(0.1);

    expect(getSingleAlignmentQuality(geneA1, geneA2, getSimilarity)).to.be.closeTo(0.05, 0.00001);
  });
});
