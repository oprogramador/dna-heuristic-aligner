import indexOf from 'indexof-limited';

const extend = (first, second, positionAtFirst, positionAtSecond, { direction, maxLeak, minLengthAfterLeak }) => {
  let shift = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (
      first[positionAtFirst + direction] === second[positionAtSecond + direction] &&
      first[positionAtFirst + direction] &&
      second[positionAtSecond + direction]
    ) {
      positionAtFirst += direction;
      positionAtSecond += direction;
      shift++;
    } else {
      const newPosition = positionAtFirst + maxLeak * direction;
      const alignmentAfterLeak = first.substr(newPosition, minLengthAfterLeak);
      const newPositionAtSecond = indexOf(
        second,
        alignmentAfterLeak,
        positionAtFirst - maxLeak * 2 - minLengthAfterLeak,
        positionAtSecond + maxLeak * 2 + minLengthAfterLeak,
      );
      if (
        direction * newPositionAtSecond > direction * positionAtSecond &&
        direction * newPositionAtSecond <= direction * (positionAtSecond + maxLeak * 2)
      ) {
        positionAtSecond = newPositionAtSecond;
        positionAtFirst = newPosition;
        shift += maxLeak;
      } else {
        break;
      }
    }
  }

  return {
    positionAtFirst,
    positionAtSecond,
    shift,
  };
};

const findStart = (first, second, positionAtFirst, positionAtSecond, { maxLeak = 5, minLengthAfterLeak = 10 } = {}) =>
  extend(first, second, positionAtFirst, positionAtSecond, { direction: -1, maxLeak, minLengthAfterLeak });

const findEnd = (first, second, positionAtFirst, positionAtSecond, { maxLeak = 5, minLengthAfterLeak = 10 } = {}) =>
  extend(first, second, positionAtFirst, positionAtSecond, { direction: 1, maxLeak, minLengthAfterLeak });

export {
  findEnd,
  findStart,
};
