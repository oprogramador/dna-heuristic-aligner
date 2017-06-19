import findMutationsWithOnlyExtending from 'dna-heuristic-aligner/findMutationsWithOnlyExtending';
import testFindMutations from 'dna-heuristic-aligner/tests/generic/testFindMutations';

describe('findMutationsWithOnlyExtending', () => {
  testFindMutations(findMutationsWithOnlyExtending);
});
