function getAllStartingNeighbors(first, second, positionAtFirst, positionAtSecond) {
  if (positionAtFirst === 0 && positionAtSecond === 0) {
    return [];
  }
  if (positionAtFirst === 0) {
    return [
      {
        positionAtFirst,
        positionAtSecond: positionAtSecond - 1,
      },
    ];
  }
  if (positionAtSecond === 0) {
    return [
      {
        positionAtFirst: positionAtFirst - 1,
        positionAtSecond,
      },
    ];
  }

  return [
    {
      positionAtFirst: positionAtFirst - 1,
      positionAtSecond,
    },
    {
      positionAtFirst,
      positionAtSecond: positionAtSecond - 1,
    },
  ];
}

export default getAllStartingNeighbors;
