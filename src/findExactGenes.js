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

function findEnd(first, second, positionAtFirst, positionAtSecond) {
  let shift = 0;
  while (
    first[positionAtFirst + 1] === second[positionAtSecond + 1] &&
    first[positionAtFirst + 1] &&
    second[positionAtSecond + 1]
  ) {
    positionAtFirst++;
    positionAtSecond++;
    shift++;
  }

  return {
    positionAtFirst,
    positionAtSecond,
    shift,
  };
}
function findExactGenes(first, second, { maxTimes = 600 } = {}) {
  const sequences = {};

  _.times(maxTimes, () => {
    const initialLength = 20;
    const start = _.random(first.sequence.length - initialLength);
    const sequenceToSearch = first.sequence.substr(start, initialLength);
    if (sequenceToSearch.includes('N')) {
      return;
    }
    const position = second.sequence.search(sequenceToSearch);
    if (position >= 0) {
      const foundStart = findStart(first.sequence, second.sequence, start, position);
      const foundEnd = findEnd(first.sequence, second.sequence, start + initialLength, position + initialLength);
      sequences[foundStart.positionAtFirst] = {
        positionAtFirst: foundStart.positionAtFirst,
        positionAtSecond: foundStart.positionAtSecond,
        sequence: first.sequence.substr(
          foundStart.positionAtFirst,
          sequenceToSearch.length + foundStart.shift + foundEnd.shift
        ),
      };
    }
  });

  return sequences;
}

export default findExactGenes;
