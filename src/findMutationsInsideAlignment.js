import { diffChars } from 'diff';

function findMutationsInsideAlignment(alignment) {
  const diff = diffChars(alignment.sequenceAtFirst, alignment.sequenceAtSecond);

  return diff.reduce(
    (accumulator, current) => {
      if (current.added) {
        const mutation = {
          positionAtFirst: accumulator.positionAtFirst,
          positionAtSecond: accumulator.positionAtSecond,
          sequenceAtFirst: '',
          sequenceAtSecond: current.value,
          type: 'insertion',
        };

        return {
          last: current,
          mutations: Object.assign({}, accumulator.mutations, { [accumulator.positionAtFirst]: mutation }),
          positionAtFirst: accumulator.positionAtFirst,
          positionAtSecond: accumulator.positionAtSecond + current.count,
        };
      } else if (current.removed) {
        const mutation = {
          positionAtFirst: accumulator.positionAtFirst,
          positionAtSecond: accumulator.positionAtSecond,
          sequenceAtFirst: current.value,
          sequenceAtSecond: '',
          type: 'deletion',
        };

        return {
          last: current,
          mutations: Object.assign({}, accumulator.mutations, { [accumulator.positionAtFirst]: mutation }),
          positionAtFirst: accumulator.positionAtFirst + current.count,
          positionAtSecond: accumulator.positionAtSecond,
        };
      }

      return {
        last: current,
        mutations: accumulator.mutations,
        positionAtFirst: accumulator.positionAtFirst + current.count,
        positionAtSecond: accumulator.positionAtSecond + current.count,
      };
    },
    {
      last: null,
      mutations: {},
      positionAtFirst: alignment.positionAtFirst,
      positionAtSecond: alignment.positionAtSecond,
    }
  )
    .mutations;
}

export default findMutationsInsideAlignment;
