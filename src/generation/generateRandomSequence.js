import _ from 'lodash';

function generateRandomSequence(length) {
  return Array.from({ length }, () => _.sample('ACGT')).join('');
}

export default generateRandomSequence;
