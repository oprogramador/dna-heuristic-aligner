import { findEnd, findStart } from 'dna-heuristic-aligner/extending';
import findMutationsInsideAlignment from 'dna-heuristic-aligner/findMutationsInsideAlignment';
import logger from 'dna-heuristic-aligner/services/logger';

const initialLength = 10;

const generateRandomInteger = i => i * initialLength;

const createCurrentProcessKey = (firstSource, secondSource) => `current-process-${JSON.stringify({
  firstSource,
  secondSource,
})}`;

async function findMutationsWithOnlyExtending(
  first,
  second,
  {
    firstSource,
    info,
    mainKey: defaultMainKey,
    manager,
    rootKey,
    secondSource,
  },
) {
  const maxTimes = Math.ceil(first.length / initialLength);
  const currentProcessKey = createCurrentProcessKey(firstSource, secondSource);
  logger.info({ currentProcessKey });

  const [root, currentProcess] = await Promise.all([
    manager.getComplex(rootKey, 2),
    manager.getComplex(currentProcessKey),
  ]);
  const { iterationNr, mainKey } = currentProcess || { iterationNr: 0, mainKey: defaultMainKey };
  await manager.setComplex(mainKey, { info });
  await manager.setComplex(rootKey, [...(root || []), mainKey]);
  for (let currentIteration = iterationNr + 1; currentIteration < maxTimes; currentIteration++) {
    if (currentIteration % 100 === 0) {
      logger.info({
        firstSource, i: currentIteration, maxTimes, secondSource,
      });
      manager.setComplex(currentProcessKey, { iterationNr: currentIteration, mainKey });
    }
    const start = generateRandomInteger(currentIteration) % first.length;
    const sequenceToSearch = first.substr(start, initialLength);
    if (sequenceToSearch.includes('N')) {
      // eslint-disable-next-line no-continue
      continue;
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
          sequenceToSearch.length + foundStart.shift + foundEnd.shift,
        ),
        sequenceAtSecond: second.substr(
          foundStart.positionAtSecond,
          sequenceToSearch.length + foundStart.shift + foundEnd.shift,
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
        sequenceToSearch.length + foundStart.shift + foundEnd.shift + diffShift,
      );

      if (
        foundSequence.sequenceAtFirst.length >= initialLength
        && foundSequence.sequenceAtFirst !== foundSequence.sequenceAtSecond
      ) {
        const mutations = findMutationsInsideAlignment(foundSequence);
        foundSequence.mutations = mutations;
        const key = foundStart.positionAtFirst;

        const result = await manager.getComplex(mainKey, 1);
        await manager.setComplex(mainKey, { ...result, [key]: foundSequence });
      }
    }
  }
  logger.info({ mainKey });
}

export default findMutationsWithOnlyExtending;
