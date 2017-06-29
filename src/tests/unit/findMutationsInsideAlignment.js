import expect from 'dna-heuristic-aligner/tests/expect';
import findMutationsInsideAlignment from 'dna-heuristic-aligner/findMutationsInsideAlignment';

describe('findMutationsInsideAlignment', () => {
  it('finds a deletion', () => {
    const subsequenceA = 'CGAACTACAAA';
    const subsequenceB = 'CTGTTT';
    const deleted = 'G';
    const alignment = {
      positionAtFirst: 123,
      positionAtSecond: 492,
      sequenceAtFirst: `${subsequenceA}${deleted}${subsequenceB}`,
      sequenceAtSecond: `${subsequenceA}${subsequenceB}`,
    };

    const positionAtFirst =
      alignment.positionAtFirst + alignment.sequenceAtFirst.indexOf(subsequenceB) - deleted.length;
    const positionAtSecond = alignment.positionAtSecond + alignment.sequenceAtSecond.indexOf(subsequenceB);
    const expected = {
      [positionAtFirst]: {
        positionAtFirst,
        positionAtSecond,
        sequenceAtFirst: deleted,
        sequenceAtSecond: '',
        type: 'deletion',
      },
    };

    expect(findMutationsInsideAlignment(alignment)).to.deep.equal(expected);
  });

  it('finds an insertion', () => {
    const subsequenceA = 'ACACCAACTCGACTCCTC';
    const subsequenceB = 'CTCCTCTTAGAGGC';
    const inserted = 'A';
    const alignment = {
      positionAtFirst: 123,
      positionAtSecond: 492,
      sequenceAtFirst: `${subsequenceA}${subsequenceB}`,
      sequenceAtSecond: `${subsequenceA}${inserted}${subsequenceB}`,
    };

    const positionAtFirst = alignment.positionAtFirst + alignment.sequenceAtFirst.indexOf(subsequenceB);
    const positionAtSecond =
      alignment.positionAtSecond + alignment.sequenceAtSecond.indexOf(subsequenceB) - inserted.length;
    const expected = {
      [positionAtFirst]: {
        positionAtFirst,
        positionAtSecond,
        sequenceAtFirst: '',
        sequenceAtSecond: inserted,
        type: 'insertion',
      },
    };

    expect(findMutationsInsideAlignment(alignment)).to.deep.equal(expected);
  });

  it.skip('finds a replacement', () => {
    const subsequenceA = 'TAATTAGTCAAAGCTT';
    const subsequenceB = 'TTGTGAGCACCAACCCGAATCGTG';
    const original = 'C';
    const replaced = 'TTA';
    const alignment = {
      positionAtFirst: 123,
      positionAtSecond: 492,
      sequenceAtFirst: `${subsequenceA}${original}${subsequenceB}`,
      sequenceAtSecond: `${subsequenceA}${replaced}${subsequenceB}`,
    };

    const positionAtFirst =
      alignment.positionAtFirst + alignment.sequenceAtFirst.indexOf(subsequenceB) - original.length;
    const positionAtSecond =
      alignment.positionAtSecond + alignment.sequenceAtSecond.indexOf(subsequenceB) - replaced.length;
    const expected = {
      [positionAtFirst]: {
        positionAtFirst,
        positionAtSecond,
        sequenceAtFirst: original,
        sequenceAtSecond: replaced,
        type: 'replacement',
      },
    };

    expect(findMutationsInsideAlignment(alignment)).to.deep.equal(expected);
  });

  it.skip('finds multiple mutations', () => {
    const subsequenceA = 'GTGTAAATGAGACG';
    const subsequenceB = 'TTATTAGCGAGTGGCGCA';
    const subsequenceC = 'ATATAAGCTTTGAAAAAGATCCGT';
    const subsequenceD = 'CTCTCACCTAGTAGCG';
    const subsequenceE = 'CGTTCATTGTGCCGAGAGAGGC';
    const subsequenceF = 'TTCGACTTGCGCAACATACTTTCAGGAA';
    const insertedA = 'GA';
    const deletedB = 'CAT';
    const originalC = 'GG';
    const replacedC = 'ATT';
    const insertedD = 'G';
    const deletedE = 'C';
    const alignment = {
      positionAtFirst: 123,
      positionAtSecond: 492,
      // eslint-disable-next-line max-len
      sequenceAtFirst: `${subsequenceA}${subsequenceB}${deletedB}${subsequenceC}${originalC}${subsequenceD}${subsequenceE}${deletedE}${subsequenceF}`,
      // eslint-disable-next-line max-len
      sequenceAtSecond: `${subsequenceA}${insertedA}${subsequenceB}${subsequenceC}${replacedC}${subsequenceD}${insertedD}${subsequenceE}${subsequenceF}`,
    };

    const expected = {
      [alignment.positionAtFirst + alignment.sequenceAtFirst.indexOf(subsequenceB)]: {
        positionAtFirst: alignment.positionAtFirst + alignment.sequenceAtFirst.indexOf(subsequenceB),
        positionAtSecond:
          alignment.positionAtSecond + alignment.sequenceAtSecond.indexOf(subsequenceB) - insertedA.length,
        sequenceAtFirst: '',
        sequenceAtSecond: insertedA,
        type: 'insertion',
      },
      [alignment.positionAtFirst + alignment.sequenceAtFirst.indexOf(subsequenceC) - deletedB.length]: {
        positionAtFirst: alignment.positionAtFirst + alignment.sequenceAtFirst.indexOf(subsequenceC) - deletedB.length,
        positionAtSecond: alignment.positionAtSecond + alignment.sequenceAtSecond.indexOf(subsequenceC),
        sequenceAtFirst: deletedB,
        sequenceAtSecond: '',
        type: 'deletion',
      },
      [alignment.positionAtFirst + alignment.sequenceAtFirst.indexOf(subsequenceD) - originalC.length]: {
        positionAtFirst: alignment.positionAtFirst + alignment.sequenceAtFirst.indexOf(subsequenceD) - originalC.length,
        positionAtSecond:
          alignment.positionAtSecond + alignment.sequenceAtSecond.indexOf(subsequenceD) - replacedC.length,
        sequenceAtFirst: originalC,
        sequenceAtSecond: replacedC,
        type: 'replacement',
      },
      [alignment.positionAtFirst + alignment.sequenceAtFirst.indexOf(subsequenceE)]: {
        positionAtFirst: alignment.positionAtFirst + alignment.sequenceAtFirst.indexOf(subsequenceE),
        positionAtSecond:
          alignment.positionAtSecond + alignment.sequenceAtSecond.indexOf(subsequenceE) - insertedD.length,
        sequenceAtFirst: '',
        sequenceAtSecond: insertedD,
        type: 'insertion',
      },
      [alignment.positionAtFirst + alignment.sequenceAtFirst.indexOf(subsequenceF) - deletedE.length]: {
        positionAtFirst: alignment.positionAtFirst + alignment.sequenceAtFirst.indexOf(subsequenceF) - deletedE.length,
        positionAtSecond: alignment.positionAtSecond + alignment.sequenceAtSecond.indexOf(subsequenceF),
        sequenceAtFirst: deletedE,
        sequenceAtSecond: '',
        type: 'deletion',
      },
    };

    expect(findMutationsInsideAlignment(alignment)).to.deep.equal(expected);
  });
});
