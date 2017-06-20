import { findEnd, findStart } from 'dna-heuristic-aligner/extending';
import _ from 'lodash';
import logger from 'dna-heuristic-aligner/services/logger';

const localRange = 100;

function findMutationsWithExtendingAndLookingNear(first, second, { generateRandomInteger, maxTimes = 600 } = {}) {
  const sequences = {};
  let start;
  let lastMutation;

  _.times(maxTimes, (i) => {
    logger.info({ i });
    const initialLength = 10;
    const shouldSearchLocally = lastMutation && generateRandomInteger() % 3 !== 0;
    if (shouldSearchLocally) {
      start += -localRange / 2 + generateRandomInteger() % localRange;
    } else {
      start = generateRandomInteger() % first.length;
    }
    const sequenceToSearch = first.substr(start, initialLength);
    if (sequenceToSearch.includes('N')) {
      return;
    }
    const position = second.search(sequenceToSearch);
    if (position >= 0) {
      const foundStart = findStart(first, second, start, position);
      const initialShift = initialLength - 1;
      const foundEnd = findEnd(first, second, start + initialShift, position + initialShift);
      const foundSequence = {
        positionAtFirst: foundStart.positionAtFirst,
        positionAtSecond: foundStart.positionAtSecond,
        sequenceAtFirst: first.substr(
          foundStart.positionAtFirst,
          sequenceToSearch.length + foundStart.shift + foundEnd.shift
        ),
        sequenceAtSecond: second.substr(
          foundStart.positionAtSecond,
          sequenceToSearch.length + foundStart.shift + foundEnd.shift
        ),
      };

      const reversedFirst = foundSequence.sequenceAtFirst.split('').reverse().join('');
      const reversedSecond = foundSequence.sequenceAtSecond.split('').reverse().join('');
      const leftDiffShift = reversedFirst.indexOf(reversedSecond.substr(0, initialLength));
      const diffShift = leftDiffShift >= 0
        ? leftDiffShift
        : -reversedSecond.indexOf(reversedFirst.substr(0, initialLength));

      foundSequence.sequenceAtSecond = second.substr(
        foundStart.positionAtSecond,
        sequenceToSearch.length + foundStart.shift + foundEnd.shift + diffShift
      );

      if (
        foundSequence.sequenceAtFirst.length >= initialLength &&
        foundSequence.sequenceAtFirst !== foundSequence.sequenceAtSecond
      ) {
        lastMutation = foundSequence.positionAtFirst;
        logger.info(foundSequence);
        sequences[foundStart.positionAtFirst] = foundSequence;
      }
    }
  });

  return sequences;
}

export default findMutationsWithExtendingAndLookingNear;
