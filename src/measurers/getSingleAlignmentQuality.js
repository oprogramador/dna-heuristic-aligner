function getSingleAlignmentQuality(first, second, getSimilarity) {
  return Math.min(first.length, second.length) * getSimilarity(first, second) ** 4;
}

export default getSingleAlignmentQuality;
