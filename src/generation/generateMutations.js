import _ from 'lodash';
import generateRandomSequence from 'dna-heuristic-aligner/generation/generateRandomSequence';

const generateRandomLength = () => Math.ceil(-1 / Math.log(Math.pow(Math.random(), 2)));
const removeRandom = sequenceAsArray =>
  sequenceAsArray.splice(_.random(sequenceAsArray.length - 1), generateRandomLength());
const insertRandom = sequenceAsArray =>
  sequenceAsArray.splice(
    _.random(sequenceAsArray.length - 1),
    0,
    ...generateRandomSequence(generateRandomLength()).split('')
  );
const replaceRandom = (sequenceAsArray) => {
  const length = generateRandomLength();
  sequenceAsArray.splice(_.random(sequenceAsArray.length - 1), length, ...generateRandomSequence(length).split(''));
};

function generateMutations(sequence, count) {
  const sequenceAsArray = sequence.split('');
  _.times(count, () => {
    const type = Math.random();
    if (type < 0.3) {
      removeRandom(sequenceAsArray);
    } else if (type < 0.6) {
      insertRandom(sequenceAsArray);
    } else {
      replaceRandom(sequenceAsArray);
    }
  });

  return sequenceAsArray.join('');
}

export default generateMutations;
