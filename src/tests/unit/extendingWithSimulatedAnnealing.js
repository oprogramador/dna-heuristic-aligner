import { findEnd, findStart } from 'dna-heuristic-aligner/extendingWithSimulatedAnnealing';
import testExtending from 'dna-heuristic-aligner/tests/generic/testExtending';

describe('extendingWithSimulatedAnnealing', () => {
  testExtending({ findEnd, findStart });
});
