import expect from 'dna-heuristic-aligner/tests/expect';
import groupClosestSequences from 'dna-heuristic-aligner/groupClosestSequences';

describe('groupClosestSequences', () => {
  it('groups close sequences', () => {
    const first = 'ACAGGGGGTTCCCGGT';
    const second = 'ACATTCTTCCCGGCC';
    const sequences = {
      0: {
        positionAtFirst: 0,
        positionAtSecond: 0,
        sequence: 'ACA',
      },
      8: {
        positionAtFirst: 8,
        positionAtSecond: 6,
        sequence: 'TTCCCGG',
      },
    };

    const distance = 10;
    const result = groupClosestSequences(first, second, sequences, distance);

    expect(result).to.deep.equal({
      0: {
        positionAtFirst: 0,
        positionAtSecond: 0,
        sequenceAtFirst: 'ACAGGGGGTTCCCGG',
        sequenceAtSecond: 'ACATTCTTCCCGG',
      },
    });
  });

  it('does not group not close sequences', () => {
    const first = 'ACAGGGGGTTCCCGGT';
    const second = 'ACATTCTTCCCGGCC';
    const sequences = {
      0: {
        positionAtFirst: 0,
        positionAtSecond: 0,
        sequence: 'ACA',
      },
      8: {
        positionAtFirst: 8,
        positionAtSecond: 6,
        sequence: 'TTCCCGG',
      },
    };

    const distance = 2;
    const result = groupClosestSequences(first, second, sequences, distance);

    expect(result).to.deep.equal({
      0: {
        positionAtFirst: 0,
        positionAtSecond: 0,
        sequenceAtFirst: 'ACA',
        sequenceAtSecond: 'ACA',
      },
      8: {
        positionAtFirst: 8,
        positionAtSecond: 6,
        sequenceAtFirst: 'TTCCCGG',
        sequenceAtSecond: 'TTCCCGG',
      },
    });
  });

  it('groups bigger data', () => {
    const first = 'ACAGGGGGTTCCCGGTCCCCCCCCTCTTTGGTTTCCGGGGAAA';
    const second = 'ACATTCTTCCCGGCCGGGGAAATCTTTAAATTTCCGGGG';
    const sequences = {
      0: {
        positionAtFirst: 0,
        positionAtSecond: 0,
        sequence: 'ACA',
      },
      8: {
        positionAtFirst: 8,
        positionAtSecond: 6,
        sequence: 'TTCCCGG',
      },
      24: {
        positionAtFirst: 24,
        positionAtSecond: 22,
        sequence: 'TCTTT',
      },
      31: {
        positionAtFirst: 31,
        positionAtSecond: 30,
        sequence: 'TTTCCGGGG',
      },
    };

    const distance = 5;
    const result = groupClosestSequences(first, second, sequences, distance);

    expect(result).to.deep.equal({
      0: {
        positionAtFirst: 0,
        positionAtSecond: 0,
        sequenceAtFirst: 'ACAGGGGGTTCCCGG',
        sequenceAtSecond: 'ACATTCTTCCCGG',
      },
      24: {
        positionAtFirst: 24,
        positionAtSecond: 22,
        sequenceAtFirst: 'TCTTTGGTTTCCGGGG',
        sequenceAtSecond: 'TCTTTAAATTTCCGGGG',
      },
    });
  });
});
