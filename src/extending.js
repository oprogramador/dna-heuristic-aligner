const maxLeak = 5;
const minLengthAfterLeak = 10;

const extend = (first, second, positionAtFirst, positionAtSecond, direction) => {
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
      shift += direction;
    } else {
      const newPosition = positionAtFirst + maxLeak * direction;
      const alignmentAfterLeak = first.substr(newPosition, minLengthAfterLeak);
      const newPositionAtSecond = second.indexOf(alignmentAfterLeak);
      if (
        direction * newPositionAtSecond > direction * positionAtSecond &&
        direction * newPositionAtSecond <= direction * (positionAtSecond + maxLeak * 2)
      ) {
        positionAtSecond = newPositionAtSecond;
        positionAtFirst = newPosition;
        shift += maxLeak * direction;
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

const findStart = (first, second, positionAtFirst, positionAtSecond) =>
  extend(first, second, positionAtFirst, positionAtSecond, -1);

const findEnd = (first, second, positionAtFirst, positionAtSecond) =>
  extend(first, second, positionAtFirst, positionAtSecond, 1);

export {
  findEnd,
  findStart,
};
