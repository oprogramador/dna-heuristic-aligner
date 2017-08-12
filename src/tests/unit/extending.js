import { findEnd, findStart } from 'dna-heuristic-aligner/extending';
import testExtending from 'dna-heuristic-aligner/tests/generic/testExtending';

describe('extending', () => {
  testExtending({ findEnd, findStart });
});
