import _ from 'lodash';
import findExactGenes from 'dna-heuristic-aligner/findExactGenes';
import groupClosestSequences from 'dna-heuristic-aligner/groupClosestSequences';

function findMutationsWithJoining(first, second, { generateRandomInteger, maxTimes }) {
  const sequences = findExactGenes(first, second, { generateRandomInteger, maxTimes });
  const groupedSequences = groupClosestSequences(first, second, sequences, 10);

  const mutatedSequencesAsArray = _.filter(groupedSequences, (group, key) => {
    delete groupedSequences[key];

    return Math.abs(Math.log(group.sequenceAtFirst.length / group.sequenceAtSecond.length)) < 0.1 &&
      group.sequenceAtFirst !== group.sequenceAtSecond;
  });

  const mutatedSequences = _.zipObject(
    mutatedSequencesAsArray.map(alignment => alignment.positionAtFirst),
    mutatedSequencesAsArray
  );

  return mutatedSequences;
}

export default findMutationsWithJoining;
