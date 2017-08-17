import _ from 'lodash';
import getAllStartingNeighbors from 'dna-heuristic-aligner/getAllStartingNeighbors';
import getSingleAlignmentQuality from 'dna-heuristic-aligner/measurers/getSingleAlignmentQuality';
import stringSimilarity from 'string-similarity';

const getSimilarity = stringSimilarity.compareTwoStrings;
const initialTemperature = 1;
const modifyTemperature = t => t * 0.99;

const findStart = (first, second, { beginAtFirst, beginAtSecond, endAtFirst, endAtSecond }) => {
  const getQuality = ({ positionAtFirst, positionAtSecond }) => getSingleAlignmentQuality(
    first.substring(positionAtFirst, endAtFirst),
    second.substring(positionAtSecond, endAtSecond),
    getSimilarity
  );
  let temperature = initialTemperature;
  let current = {
    positionAtFirst: beginAtFirst,
    positionAtSecond: beginAtSecond,
  };
  let best = current;
  let currentQuality = getQuality({ positionAtFirst: beginAtFirst, positionAtSecond: beginAtSecond });
  let bestQuality = currentQuality;
  while (temperature > 0.1) {
    const neighbors = getAllStartingNeighbors(first, second, current.positionAtFirst, current.positionAtSecond);
    if (!neighbors.length) {
      break;
    }
    const bestNeighbor = _.maxBy(neighbors, getQuality);
    const bestNeighborQuality = getQuality(bestNeighbor);
    if (bestNeighborQuality > bestQuality) {
      bestQuality = bestNeighborQuality;
      best = bestNeighbor;
    }
    if (bestNeighborQuality / currentQuality > Math.exp(-temperature)) {
      currentQuality = bestNeighborQuality;
      current = bestNeighbor;
    }
    temperature = modifyTemperature(temperature);
  }

  return Object.assign({}, best, { shift: beginAtFirst - best.positionAtFirst });
};
const findEnd = () => {};

export {
  findEnd,
  findStart,
};
