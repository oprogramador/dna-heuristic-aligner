import expect from 'dna-heuristic-aligner/tests/expect';
import sumSequencesLength from 'dna-heuristic-aligner/measurers/sumSequencesLength';

describe('sumSequencesLength', () => {
  it('sums lengths', () => {
    const data = {
      bar: {
        sequence: 'd',
      },
      baz: {
        sequence: 'eijk',
      },
      foo: {
        sequence: 'abc',
      },
    };

    const expected = 8;
    expect(sumSequencesLength(data)).to.equal(expected);
  });
});
