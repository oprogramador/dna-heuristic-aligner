function getAllNeighbors({
  distance = 1,
  maxFirst,
  maxSecond,
  minFirst = 0,
  minSecond = 0,
  positionAtFirst,
  positionAtSecond,
}) {
  const all = [
    {
      positionAtFirst: positionAtFirst - distance,
      positionAtSecond,
    },
    {
      positionAtFirst,
      positionAtSecond: positionAtSecond - distance,
    },
    {
      positionAtFirst: positionAtFirst + distance,
      positionAtSecond,
    },
    {
      positionAtFirst,
      positionAtSecond: positionAtSecond + distance,
    },
  ];

  return all.filter(item => item.positionAtFirst >= minFirst
    && item.positionAtSecond >= minSecond
    && item.positionAtFirst <= maxFirst
    && item.positionAtSecond <= maxSecond);
}

export default getAllNeighbors;
