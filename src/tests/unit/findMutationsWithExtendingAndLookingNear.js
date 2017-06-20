import findMutationsWithExtendingAndLookingNear from 'dna-heuristic-aligner/findMutationsWithExtendingAndLookingNear';
import testFindMutations from 'dna-heuristic-aligner/tests/generic/testFindMutations';

describe('findMutationsWithExtendingAndLookingNear', () => {
  testFindMutations(findMutationsWithExtendingAndLookingNear);
});
