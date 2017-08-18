import expect from 'dna-heuristic-aligner/tests/expect';
import getAllNeighbors from 'dna-heuristic-aligner/getAllNeighbors';

describe('getAllNeighbors', () => {
  it('gets all neighbor combinations when it is far from the edge', () => {
    expect(getAllNeighbors({
      distance: 1,
      maxFirst: 100,
      maxSecond: 100,
      minFirst: 0,
      minSecond: 0,
      positionAtFirst: 2,
      positionAtSecond: 4,
    })).to.deep.equal([
      {
        positionAtFirst: 1,
        positionAtSecond: 4,
      },
      {
        positionAtFirst: 2,
        positionAtSecond: 3,
      },
      {
        positionAtFirst: 3,
        positionAtSecond: 4,
      },
      {
        positionAtFirst: 2,
        positionAtSecond: 5,
      },
    ]);
  });

  it('gets neighbor combinations when it exceeds first min edge', () => {
    expect(getAllNeighbors({
      distance: 1,
      maxFirst: 100,
      maxSecond: 100,
      minFirst: 2,
      minSecond: 0,
      positionAtFirst: 2,
      positionAtSecond: 4,
    })).to.deep.equal([
      {
        positionAtFirst: 2,
        positionAtSecond: 3,
      },
      {
        positionAtFirst: 3,
        positionAtSecond: 4,
      },
      {
        positionAtFirst: 2,
        positionAtSecond: 5,
      },
    ]);
  });

  it('gets neighbor combinations when it exceeds first max edge', () => {
    expect(getAllNeighbors({
      distance: 1,
      maxFirst: 2,
      maxSecond: 100,
      minFirst: 0,
      minSecond: 0,
      positionAtFirst: 2,
      positionAtSecond: 4,
    })).to.deep.equal([
      {
        positionAtFirst: 1,
        positionAtSecond: 4,
      },
      {
        positionAtFirst: 2,
        positionAtSecond: 3,
      },
      {
        positionAtFirst: 2,
        positionAtSecond: 5,
      },
    ]);
  });

  it('gets neighbor combinations when it exceeds second min edge', () => {
    expect(getAllNeighbors({
      distance: 1,
      maxFirst: 100,
      maxSecond: 100,
      minFirst: 0,
      minSecond: 4,
      positionAtFirst: 2,
      positionAtSecond: 4,
    })).to.deep.equal([
      {
        positionAtFirst: 1,
        positionAtSecond: 4,
      },
      {
        positionAtFirst: 3,
        positionAtSecond: 4,
      },
      {
        positionAtFirst: 2,
        positionAtSecond: 5,
      },
    ]);
  });

  it('gets neighbor combinations when it exceeds second max edge', () => {
    expect(getAllNeighbors({
      distance: 1,
      maxFirst: 100,
      maxSecond: 4,
      minFirst: 0,
      minSecond: 0,
      positionAtFirst: 2,
      positionAtSecond: 4,
    })).to.deep.equal([
      {
        positionAtFirst: 1,
        positionAtSecond: 4,
      },
      {
        positionAtFirst: 2,
        positionAtSecond: 3,
      },
      {
        positionAtFirst: 3,
        positionAtSecond: 4,
      },
    ]);
  });

  it('gets neighbors at big distance', () => {
    expect(getAllNeighbors({
      distance: 5,
      maxFirst: 100,
      maxSecond: 100,
      minFirst: -100,
      minSecond: -100,
      positionAtFirst: 2,
      positionAtSecond: 4,
    })).to.deep.equal([
      {
        positionAtFirst: -3,
        positionAtSecond: 4,
      },
      {
        positionAtFirst: 2,
        positionAtSecond: -1,
      },
      {
        positionAtFirst: 7,
        positionAtSecond: 4,
      },
      {
        positionAtFirst: 2,
        positionAtSecond: 9,
      },
    ]);
  });
});
