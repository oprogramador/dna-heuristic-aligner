import expect from 'dna-heuristic-aligner/tests/expect';
import getAllStartingNeighbors from 'dna-heuristic-aligner/getAllStartingNeighbors';

describe('getAllStartingNeighbors', () => {
  it('gets all neighbor combinations for extending towards left when it is far from the edge', () => {
    const geneA1 = 'ACGTCCG';
    const geneA2 = 'TCACGTCCG';

    expect(getAllStartingNeighbors(geneA1, geneA2, 2, 4)).to.deep.equal([
      {
        positionAtFirst: 1,
        positionAtSecond: 4,
      },
      {
        positionAtFirst: 2,
        positionAtSecond: 3,
      },
    ]);
  });

  it('gets all neighbor combinations for extending towards left when it is at the edge of the first sequence', () => {
    const geneA1 = 'ACGTCCG';
    const geneA2 = 'TCACGTCCG';

    expect(getAllStartingNeighbors(geneA1, geneA2, 0, 4)).to.deep.equal([
      {
        positionAtFirst: 0,
        positionAtSecond: 3,
      },
    ]);
  });

  it('gets all neighbor combinations for extending towards left when it is at the edge of the second sequence', () => {
    const geneA1 = 'ACGTCCG';
    const geneA2 = 'TCACGTCCG';

    expect(getAllStartingNeighbors(geneA1, geneA2, 2, 0)).to.deep.equal([
      {
        positionAtFirst: 1,
        positionAtSecond: 0,
      },
    ]);
  });

  it('gets all neighbor combinations for extending towards left when it is the edge of both sequences', () => {
    const geneA1 = 'ACGTCCG';
    const geneA2 = 'TCACGTCCG';

    expect(getAllStartingNeighbors(geneA1, geneA2, 0, 0)).to.deep.equal([]);
  });
});
