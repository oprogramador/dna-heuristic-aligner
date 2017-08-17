function getAllStartingNeighbors(first, second, positionAtFirst, positionAtSecond) {
  const all = [
    {
      positionAtFirst: positionAtFirst - 1,
      positionAtSecond,
    },
    {
      positionAtFirst,
      positionAtSecond: positionAtSecond - 1,
    },
    {
      positionAtFirst: positionAtFirst + 1,
      positionAtSecond,
    },
    {
      positionAtFirst,
      positionAtSecond: positionAtSecond + 1,
    },
  ];

  return all.filter(item =>
    item.positionAtFirst >= 0 &&
    item.positionAtSecond >= 0 &&
    item.positionAtFirst < first.length &&
    item.positionAtSecond < second.length
  );
}

export default getAllStartingNeighbors;
