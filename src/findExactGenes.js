import { findEnd, findStart } from 'dna-heuristic-aligner/extending';
import _ from 'lodash';
import logger from 'dna-heuristic-aligner/services/logger';

function findExactGenes(first, second, { generateRandomInteger, maxTimes = 600 } = {}) {
  const sequences = {};

  _.times(maxTimes, (i) => {
    logger.info({ i });
    const initialLength = 10;
    const start = generateRandomInteger() % first.length;
    const sequenceToSearch = first.substr(start, initialLength);
    if (sequenceToSearch.includes('N')) {
      return;
    }
    const position = second.search(sequenceToSearch);
    if (position >= 0) {
      const foundStart = findStart(first, second, start, position, { maxLeak: 0 });
      const initialShift = initialLength - 1;
      const foundEnd = findEnd(first, second, start + initialShift, position + initialShift, { maxLeak: 0 });
      const foundSequence = {
        positionAtFirst: foundStart.positionAtFirst,
        positionAtSecond: foundStart.positionAtSecond,
        sequence: first.substr(
          foundStart.positionAtFirst,
          sequenceToSearch.length + foundStart.shift + foundEnd.shift
        ),
      };
      if (foundSequence.sequence.length >= initialLength) {
        logger.info(foundSequence);
        sequences[foundStart.positionAtFirst] = foundSequence;
      }
    }
  });

  return sequences;
}

export default findExactGenes;
