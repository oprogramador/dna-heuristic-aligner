import { findEnd, findStart } from 'dna-heuristic-aligner/extending';
import bluebird from 'bluebird';
import findMutationsInsideAlignment from 'dna-heuristic-aligner/findMutationsInsideAlignment';
import logger from 'dna-heuristic-aligner/services/logger';

const initialLength = 10;

const generateRandomInteger = i => i * initialLength;

const createCurrentProcessKey = (firstSource, secondSource) =>
  `current-process-${JSON.stringify({ firstSource, secondSource })}`;

const executeSequentially = (maxTimes, callback) =>
  bluebird.reduce(new Array(maxTimes), (accumulator, nothing, i) => callback(i));

function findMutationsWithOnlyExtending(
  first,
  second,
  {
    firstSource,
    secondSource,
    manager,
    mainKey: defaultMainKey,
    rootKey,
  }
) {
  const maxTimes = Math.ceil(first.length / initialLength);
  const currentProcessKey = createCurrentProcessKey(firstSource, secondSource);

  return Promise.all([
    manager.getComplex(rootKey, 2),
    manager.getComplex(currentProcessKey),
  ])
    .then(([root, currentProcess]) => {
      const { iterationNr, mainKey } = currentProcess || { iterationNr: 0, mainKey: defaultMainKey };

      return manager.setComplex(rootKey, [...(root || []), mainKey])
        .then(() => ({ iterationNr, mainKey }));
    })
    .then(({ iterationNr, mainKey }) => executeSequentially(maxTimes - iterationNr, (i) => {
      const currentIteration = iterationNr + i;
      if (currentIteration % 100 === 0) {
        logger.info({ firstSource, i: currentIteration, maxTimes, secondSource });
        manager.setComplex(currentProcessKey, { iterationNr: currentIteration, mainKey });
      }
      const start = generateRandomInteger(currentIteration) % first.length;
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

          return manager.getComplex(mainKey, 1)
            .then(result => manager.setComplex(mainKey, Object.assign({}, result, { [key]: foundSequence })));
        }

        return Promise.resolve();
      }

      return Promise.resolve();
    }));
}

export default findMutationsWithOnlyExtending;
