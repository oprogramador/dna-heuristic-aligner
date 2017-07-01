import { diffChars } from 'diff';

function findMutationsInsideAlignment(alignment) {
  const diff = diffChars(alignment.sequenceAtFirst, alignment.sequenceAtSecond);

  return diff.reduce(
    (accumulator, current) => {
      if (
        accumulator.lastDiff &&
        (current.added || current.removed) &&
        (accumulator.lastDiff.added || accumulator.lastDiff.removed)
      ) {
        delete accumulator.mutations[accumulator.lastMutation.positionAtFirst];

        const mutation = {
          positionAtFirst: accumulator.lastMutation.positionAtFirst,
          positionAtSecond: accumulator.lastMutation.positionAtSecond,
          sequenceAtFirst: accumulator.lastMutation.sequenceAtFirst + (current.deleted ? current.value : ''),
          sequenceAtSecond: accumulator.lastMutation.sequenceAtSecond + (current.added ? current.value : ''),
          type: 'replacement',
        };

        return {
          lastDiff: current,
          lastMutation: mutation,
          mutations: Object.assign({}, accumulator.mutations, { [accumulator.lastMutation.positionAtFirst]: mutation }),
          positionAtFirst: accumulator.positionAtFirst + (current.deleted ? current.count : 0),
          positionAtSecond: accumulator.positionAtSecond + (current.added ? current.count : 0),
        };
      }
      if (current.added) {
        const mutation = {
          positionAtFirst: accumulator.positionAtFirst,
          positionAtSecond: accumulator.positionAtSecond,
          sequenceAtFirst: '',
          sequenceAtSecond: current.value,
          type: 'insertion',
        };

        return {
          lastDiff: current,
          lastMutation: mutation,
          mutations: Object.assign({}, accumulator.mutations, { [accumulator.positionAtFirst]: mutation }),
          positionAtFirst: accumulator.positionAtFirst,
          positionAtSecond: accumulator.positionAtSecond + current.count,
        };
      }
      if (current.removed) {
        const mutation = {
          positionAtFirst: accumulator.positionAtFirst,
          positionAtSecond: accumulator.positionAtSecond,
          sequenceAtFirst: current.value,
          sequenceAtSecond: '',
          type: 'deletion',
        };

        return {
          lastDiff: current,
          lastMutation: mutation,
          mutations: Object.assign({}, accumulator.mutations, { [accumulator.positionAtFirst]: mutation }),
          positionAtFirst: accumulator.positionAtFirst + current.count,
          positionAtSecond: accumulator.positionAtSecond,
        };
      }

      return {
        lastDiff: current,
        mutations: accumulator.mutations,
        positionAtFirst: accumulator.positionAtFirst + current.count,
        positionAtSecond: accumulator.positionAtSecond + current.count,
      };
    },
    {
      lastDiff: null,
      lastMutation: null,
      mutations: {},
      positionAtFirst: alignment.positionAtFirst,
      positionAtSecond: alignment.positionAtSecond,
    }
  )
    .mutations;
}

export default findMutationsInsideAlignment;
