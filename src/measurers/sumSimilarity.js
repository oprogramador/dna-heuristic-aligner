import _ from 'lodash';

function sumSimilarity(data, getSimilarity) {
  return _.sum(_.values(data).map(value => getSimilarity(value.sequenceAtFirst, value.sequenceAtSecond)));
}

export default sumSimilarity;
