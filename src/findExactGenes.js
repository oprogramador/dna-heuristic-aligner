import _ from 'lodash';
import logger from 'dna-heuristic-aligner/services/logger';

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

  _.times(maxTimes, (i) => {
    logger.info({ i });
    const initialLength = 20;
    const start = _.random(first.sequence.length - initialLength);
    const sequenceToSearch = first.sequence.substr(start, initialLength);
    if (sequenceToSearch.includes('N')) {
      return;
    }
    const position = second.sequence.search(sequenceToSearch);
    if (position >= 0) {
      const foundStart = findStart(first.sequence, second.sequence, start, position);
      const initialShift = initialLength - 1;
      const foundEnd = findEnd(first.sequence, second.sequence, start + initialShift, position + initialShift);
      const foundSequence = {
        positionAtFirst: foundStart.positionAtFirst,
        positionAtSecond: foundStart.positionAtSecond,
        sequence: first.sequence.substr(
          foundStart.positionAtFirst,
          sequenceToSearch.length + foundStart.shift + foundEnd.shift
        ),
      };
      logger.info(foundSequence);
      sequences[foundStart.positionAtFirst] = foundSequence;
    }
  });

  return sequences;
}

export default findExactGenes;
