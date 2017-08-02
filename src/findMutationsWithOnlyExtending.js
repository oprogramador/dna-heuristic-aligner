import { findEnd, findStart } from 'dna-heuristic-aligner/extending';
import bluebird from 'bluebird';
import findMutationsInsideAlignment from 'dna-heuristic-aligner/findMutationsInsideAlignment';
import logger from 'dna-heuristic-aligner/services/logger';

const initialLength = 10;

const generateRandomInteger = (() => {
  let i = 0;

  const generate = () => {
    i += initialLength;

    return i;
  };

  return generate;
})();

function findMutationsWithOnlyExtending(first, second, { manager, mainKey, rootKey }) {
  const maxTimes = Math.ceil(first.length / initialLength);

  return manager.getComplex(rootKey, 2)
    .then(root => manager.setComplex(rootKey, [...(root || []), mainKey]))
    .then(() => bluebird.reduce(new Array(maxTimes), (accumulator, nothing, i) => {
      if (i % 100 === 0) {
        logger.info({ i, maxTimes });
      }
      const start = generateRandomInteger() % first.length;
      const sequenceToSearch = first.substr(start, initialLength);
      if (sequenceToSearch.includes('N')) {
        return Promise.resolve();
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
          const mutations = findMutationsInsideAlignment(foundSequence);
          foundSequence.mutations = mutations;
          const key = foundStart.positionAtFirst;

          return manager.getComplex(mainKey, 2)
            .then(result => manager.setComplex(mainKey, Object.assign({}, result, { [key]: foundSequence })));
        }

        return Promise.resolve();
      }

      return Promise.resolve();
    }));
}

export default findMutationsWithOnlyExtending;
