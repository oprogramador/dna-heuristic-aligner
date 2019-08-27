import { diffChars } from 'diff';

function findMutationsInsideAlignment(alignment) {
  const diff = diffChars(alignment.sequenceAtFirst, alignment.sequenceAtSecond);

  return diff.reduce(
    ({
      lastDiff, lastMutation, mutations, positionAtFirst, positionAtSecond,
    }, current) => {
      if (
        lastDiff
        && (current.added || current.removed)
        && (lastDiff.added || lastDiff.removed)
      ) {
        delete mutations[lastMutation.positionAtFirst];

        const mutation = {
          positionAtFirst: lastMutation.positionAtFirst,
          positionAtSecond: lastMutation.positionAtSecond,
          sequenceAtFirst: lastMutation.sequenceAtFirst + (current.deleted ? current.value : ''),
          sequenceAtSecond: lastMutation.sequenceAtSecond + (current.added ? current.value : ''),
          type: 'replacement',
        };

        return {
          lastDiff: current,
          lastMutation: mutation,
          mutations: { ...mutations, [lastMutation.positionAtFirst]: mutation },
          positionAtFirst: positionAtFirst + (current.deleted ? current.count : 0),
          positionAtSecond: positionAtSecond + (current.added ? current.count : 0),
        };
      }
      if (current.added) {
        const mutation = {
          positionAtFirst,
          positionAtSecond,
          sequenceAtFirst: '',
          sequenceAtSecond: current.value,
          type: 'insertion',
        };

        return {
          lastDiff: current,
          lastMutation: mutation,
          mutations: { ...mutations, [positionAtFirst]: mutation },
          positionAtFirst,
          positionAtSecond: positionAtSecond + current.count,
        };
      }
      if (current.removed) {
        const mutation = {
          positionAtFirst,
          positionAtSecond,
          sequenceAtFirst: current.value,
          sequenceAtSecond: '',
          type: 'deletion',
        };

        return {
          lastDiff: current,
          lastMutation: mutation,
          mutations: { ...mutations, [positionAtFirst]: mutation },
          positionAtFirst: positionAtFirst + current.count,
          positionAtSecond,
        };
      }

      return {
        lastDiff: current,
        mutations,
        positionAtFirst: positionAtFirst + current.count,
        positionAtSecond: positionAtSecond + current.count,
      };
    },
    {
      lastDiff: null,
      lastMutation: null,
      mutations: {},
      positionAtFirst: alignment.positionAtFirst,
      positionAtSecond: alignment.positionAtSecond,
    },
  )
    .mutations;
}

export default findMutationsInsideAlignment;
