import _ from 'lodash';

function groupClosestSequences(first, second, sequences, distance) {
  const sequencesAsArray = _.values(sequences);
  const resultAsArray = sequencesAsArray.reduce(
    ({ result, last, toIgnore }, current) => {
      if (!last) {
        return {
          last: current,
          result,
          toIgnore: [],
        };
      }
      const endOfLastAtFirst = last.positionAtFirst + last.sequence.length;
      const endOfLastAtSecond = last.positionAtSecond + last.sequence.length;

      const areClose = current.positionAtFirst - endOfLastAtFirst <= distance &&
        current.positionAtSecond - endOfLastAtSecond <= distance;

      let newSequences = [];
      if (areClose) {
        newSequences = [
          {
            positionAtFirst: last.positionAtFirst,
            positionAtSecond: last.positionAtSecond,
            sequenceAtFirst: first.substring(last.positionAtFirst, current.positionAtFirst + current.sequence.length),
            sequenceAtSecond: second.substring(
              last.positionAtSecond,
              current.positionAtSecond + current.sequence.length
            ),
          },
        ];
      } else {
        if (!toIgnore.includes(last.positionAtFirst)) {
          newSequences.push({
            positionAtFirst: last.positionAtFirst,
            positionAtSecond: last.positionAtSecond,
            sequenceAtFirst: last.sequence,
            sequenceAtSecond: last.sequence,
          });
        }
        if (!toIgnore.includes(current.positionAtFirst)) {
          newSequences.push({
            positionAtFirst: current.positionAtFirst,
            positionAtSecond: current.positionAtSecond,
            sequenceAtFirst: current.sequence,
            sequenceAtSecond: current.sequence,
          });
        }
      }

      return {
        last: current,
        result: [...result, ...newSequences],
        toIgnore: [...toIgnore, ...(areClose ? [current.positionAtFirst] : [])],
      };
    },
    {
      result: [],
      toIgnore: [],
    }
  )
    .result;

  return _.zipObject(resultAsArray.map(sequence => sequence.positionAtFirst), resultAsArray);
}

export default groupClosestSequences;
