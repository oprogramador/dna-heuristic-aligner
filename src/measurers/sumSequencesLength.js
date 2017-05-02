import _ from 'lodash';

function sumSequencesLength(data) {
  return _.sum(_.values(data).map(value => value.sequence.length));
}

export default sumSequencesLength;
