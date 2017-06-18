import findMutationsWithJoining from 'dna-heuristic-aligner/findMutationsWithJoining';
import testFindMutations from 'dna-heuristic-aligner/tests/generic/testFindMutations';

describe('findMutationsWithJoining', () => {
  testFindMutations(findMutationsWithJoining);
});
