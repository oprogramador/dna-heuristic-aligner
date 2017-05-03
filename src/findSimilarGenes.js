import _ from 'lodash';

function findStart(first, second, positionAtFirst, positionAtSecond) {
  while (first[positionAtFirst] === second[positionAtSecond] && first[positionAtFirst] && second[positionAtSecond]) {
    positionAtFirst--;
    positionAtSecond--;
  }

  return {
    positionAtFirst,
    positionAtSecond,
  };
}

function findSimilarGenes(first, second, { maxTimes = 3000 } = {}) {
  const sequences = {};

  _.times(maxTimes, () => {
    let sequenceLength = 20;
    const start = _.random(first.sequence.length - sequenceLength);
    let sequence;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      sequence = first.sequence.substr(start, sequenceLength);
      sequenceLength++;
      const position = second.sequence.search(sequence);
      const { positionAtFirst, positionAtSecond } = findStart(first, second, start, position);
      if (position >= 0) {
        sequences[start] = {
          positionAtFirst,
          positionAtSecond,
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
