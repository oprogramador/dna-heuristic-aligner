function getAllNeighbors({
  distance,
  maxFirst,
  maxSecond,
  minFirst,
  minSecond,
  positionAtFirst,
  positionAtSecond,
} = {
  distance: 1,
  minFirst: 0,
  minSecond: 0,
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

  return all.filter(item =>
    item.positionAtFirst >= minFirst &&
    item.positionAtSecond >= minSecond &&
    item.positionAtFirst <= maxFirst &&
    item.positionAtSecond <= maxSecond
  );
}

export default getAllNeighbors;
