import _ from 'lodash';

function findStart(first, second, positionAtFirst, positionAtSecond) {
  let shift = 0;
  while (
    first[positionAtFirst - 1] === second[positionAtSecond - 1] &&
    first[positionAtFirst - 1] &&
    second[positionAtSecond - 1]
  ) {
    positionAtFirst--;
    positionAtSecond--;
    shift++;
  }

  return {
    positionAtFirst,
    positionAtSecond,
    shift,
  };
}

function findSimilarGenes(first, second, { maxTimes = 600 } = {}) {
  const sequences = {};

  _.times(maxTimes, () => {
    let sequenceLength = 20;
    const start = _.random(first.sequence.length - sequenceLength);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const sequenceToSearch = first.sequence.substr(start, sequenceLength);
      if (sequenceToSearch.includes('N')) {
        break;
      }
      sequenceLength++;
      const position = second.sequence.search(sequenceToSearch);
      if (position >= 0) {
        const { positionAtFirst, positionAtSecond, shift } =
          findStart(first.sequence, second.sequence, start, position);
        sequences[positionAtFirst] = {
          positionAtFirst,
          positionAtSecond,
          sequence: first.sequence.substr(positionAtFirst, sequenceToSearch.length + shift),
        };
      } else {
        break;
      }
    }
  });

  return sequences;
}

export default findSimilarGenes;
