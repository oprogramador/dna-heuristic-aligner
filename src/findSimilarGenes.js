import _ from 'lodash';

function findSimilarGenes(first, second) {
  const sequences = {};

  _.times(3000, () => {
    let sequenceLength = 20;
    const start = _.random(first.sequence.length - sequenceLength);
    let sequence;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      sequence = first.sequence.substr(start, sequenceLength);
      sequenceLength++;
      const position = second.sequence.search(sequence);
      if (position >= 0) {
        sequences[start] = {
          positionAtFirst: start,
          positionAtSecond: position,
          sequence,
        };
      } else {
        break;
      }
    }
  });

  return sequences;
}

export default findSimilarGenes;
