import { AdvancedManager, InMemorySimpleManager } from 'grapedb';
import expect from 'dna-heuristic-aligner/tests/expect';
import realLogger from 'dna-heuristic-aligner/services/logger';

const generateFakeIntegerFunction = () => {
  let i = 0;

  const generate = () => {
    i++;

    return i;
  };

  return generate;
};


const rootKey = 'foo-root';

const logger = {
  error: realLogger.error,
  info: () => {},
};

function testFindMutations(findMutations) {
  describe('findMutations', () => {
    it('appends result to root', () => {
      const first = 'TTGAAGAGTTGTCCAGAGGGCCCT';
      const second = 'TTGAAGAGTTGTCCAGACGGCCCT';
      const mainKey = 'foo-main';
      const manager = new AdvancedManager(new InMemorySimpleManager(), logger);

      return manager.setComplex(rootKey, ['a', 'b'])
        .then(() => findMutations(
          first,
          second,
          {
            generateRandomInteger: generateFakeIntegerFunction(),
            mainKey,
            manager,
            maxTimes: 1000,
            rootKey,
          },
        ))
        .then(() => expect(manager.getComplex(rootKey)).to.eventually.deep.equal(['a', 'b', mainKey]));
    });

    it('creates root when previously non-existent', () => {
      const first = 'TTGAAGAGTTGTCCAGAGGGCCCT';
      const second = 'TTGAAGAGTTGTCCAGACGGCCCT';
      const mainKey = 'foo-main';
      const manager = new AdvancedManager(new InMemorySimpleManager(), logger);

      return findMutations(
        first,
        second,
        {
          generateRandomInteger: generateFakeIntegerFunction(),
          mainKey,
          manager,
          maxTimes: 1000,
          rootKey,
        },
      )
        .then(() => expect(manager.getComplex(rootKey)).to.eventually.deep.equal([mainKey]));
    });

    it('finds all short mutations - simple', () => {
      const geneA1 = 'GAAGATACCAGGAACAAGCCACCGCTCACCACCTTGGATGAACGTGTAGTAGCGGACTCG';
      const geneA2 = 'GAAGATACCAGGAACAAGCCACCGCTCACCACCTTGGATGCACGTGTAGTAGCGGACTCG';

      const geneB1 = 'GCGGGGTCAGTCCCCCAATTGACCAGCGCCGCTCTAGGCGCCCCGATTCTGCAAAGTACACCACTTCTTCAT';
      const geneB2 = 'GCGGGGTCAGTCCCCCAATTGACCAGCGACCGCTCTAGGCGCCCCGATTCTGCAAAGTACACCACTTCTTCAT';

      const geneC1 = 'AACACTCTTTATCAGATCCTAGTAAGGCAGGTTTGTACGGTGTGGTTCCAAGGTAGCCTGCAG';
      const geneC2 = 'AACACTCTTTATCAGATCCTAGTAAGGCAGGTTTGTAAGGTGTGGTTCCAAGGTAGCCTGCAG';

      const geneK = 'ACGCCGTAAGCGTGTTTCCCAGAA';
      const geneL = 'CGTAGGTCCTGTTGTCTACAAACTAATACCGAAGCAATTACCATTTCAGAGGAATGACATGTC';
      const geneM = 'GAACAGCCGGGACTCGCCCACGAGCACAACTTCAAGAAGATTCAAGGG';

      const first = `${geneA1}${geneK}${geneB1}${geneL}${geneC1}`;
      const second = `${geneA2}${geneL}${geneB2}${geneM}${geneC2}`;

      const expectedMutations = {
        [first.indexOf(geneA1)]: {
          mutations: {
            40: {
              positionAtFirst: 40,
              positionAtSecond: 40,
              sequenceAtFirst: '',
              sequenceAtSecond: 'C',
              type: 'insertion',
            },
            41: {
              positionAtFirst: 41,
              positionAtSecond: 42,
              sequenceAtFirst: 'A',
              sequenceAtSecond: '',
              type: 'deletion',
            },
          },
          positionAtFirst: first.indexOf(geneA1),
          positionAtSecond: second.indexOf(geneA2),
          sequenceAtFirst: geneA1,
          sequenceAtSecond: geneA2,
        },
        [first.indexOf(geneB1)]: {
          mutations: {
            112: {
              positionAtFirst: 112,
              positionAtSecond: 151,
              sequenceAtFirst: '',
              sequenceAtSecond: 'A',
              type: 'insertion',
            },
          },
          positionAtFirst: first.indexOf(geneB1),
          positionAtSecond: second.indexOf(geneB2),
          sequenceAtFirst: geneB1,
          sequenceAtSecond: geneB2,
        },
        [first.indexOf(geneC1)]: {
          mutations: {
            256: {
              positionAtFirst: 256,
              positionAtSecond: 281,
              sequenceAtFirst: 'C',
              sequenceAtSecond: 'A',
              type: 'replacement',
            },
          },
          positionAtFirst: first.indexOf(geneC1),
          positionAtSecond: second.indexOf(geneC2),
          sequenceAtFirst: geneC1,
          sequenceAtSecond: geneC2,
        },
      };
      const mainKey = 'foo-main';
      const manager = new AdvancedManager(new InMemorySimpleManager(), logger);

      return findMutations(
        first,
        second,
        {
          generateRandomInteger: generateFakeIntegerFunction(),
          mainKey,
          manager,
          maxTimes: 1000,
          rootKey,
        },
      )
        .then(() => expect(manager.getComplex(mainKey)).to.eventually.deep.equal(expectedMutations));
    });

    it('finds all short mutations - complex', () => {
      const geneA1 = 'GACCGACGTTGTGTCAACGCCGGCAGGAACACGCGTCGTCATCCGTTAATCCGGGAGATGTTACGAGATGGA';
      const geneA2 = 'GACCGACGTTGTGTCAACGCCGGCAGGAACACGCGTCGTCATCCGTTATCCGGGAGATGTTACGAGATGGA';

      const geneB1 = 'GCCTAATGAGCTTAACCTTGGCTCAAACACGAGTCGGTTGTAGGATTCACATAATCTCCCCACGAGTGTGCCAGTTTT';
      const geneB2 = 'GCCTAATGAGCTTAACCTTGGCTCAAACACGAGTCGGTTGTCAGGATTCACATAATCTCCCCACGAGTGTGCCAGTTTT';

      const geneC1 = 'CGGTCCCCGTAAGTTATCTTGGTTAACAGCTACCAAAGGGTTTCGTGAGACCTTCCGCGTGGACGA';
      const geneC2 = 'CGGTCCCCGTAAGTTATCTTGGTTAACAGCTACCAAAGGCTTTCGTGAGACCTTCCGCGTGGACGA';

      const geneD1 = 'ACAGGAGACGCCTGGACCTCAGCGACCTAGAGATACGTAATAGAAACCGCCGTCGCGAAACAGCTAGCTCATTGG';
      const geneD2 = 'ACAGGAGACGCCTGGACCTCAGCGACCTAGAGATACGTAATAGTAGAAACCGCCGTCGCGAAACAGCTAGCTCATTGG';

      const geneE1 = 'TTTATGTTCGACAGAGGGTCGAGTCCTTGCCCGTACTATAACTCCGATGCTCTGGTCCGGCGTAATTAATAGCATTCA';
      const geneE2 = 'TTTATGTTCGACAGAGGGTCGAGTCCTTGCCCGTACTATAACTCCGATGCCTGGTCCGGCGTAATTAATAGCATTCA';

      const geneF1 = 'TTGTGATTAACAGATGCAATAGACTTTTTTAGTTGATAGACGGGCATTCCTAACCTGCTATTTGAAGATTCAGTAGCTAAC';
      const geneF2 = 'TTGTGATTAACAGATGCAATAGACTTTTTTAGTTGATAGACGGGCATTCCCTAACCTGCTATTTGAAGATTCAGTAGCTAAC';

      const geneG1 = 'AAAAAGCCTGTCGTGGGAGACACGTCCGCCTTTTTCTTCTGAAGTGTGCTCCGGTTATTAGAGATAAGCCGGCGATTC';
      const geneG2 = 'AAAAAGCCTGTCGTGGGAGACACGTCCGCCTTTTTCTTCTGAAGTGTGCTCCCGTTATTAGAGATAAGCCGGCGATTC';

      const geneH1 = 'GGGGTCCGTGTAACATTCTATTAATTAAAATGCTACGGATTTAATGTCGGGTGCTCGCTATATTAAGTTTTACGGAAGAACCCG';
      const geneH2 = 'GGGGTCCGTGTAACATTCTATTAATTAAAATGCTACGGATTTAATGTCGGTGCTCGCTATATTAAGTTTTACGGAAGAACCCG';

      const geneI1 = 'TCTCTTCATCTGAAACGCGATCTCACTTAATTTTCAATGTCGGCCATCGGAGGCAGGAGTCTCGATAGGCTTTTAAACACG';
      const geneI2 = 'TCTCTTCATCTGAAACGCGATCTCACTCTAATTTTCAATGTCGGCCATCGGAGGCAGGAGTCTCGATAGGCTTTTAAACACG';

      const geneJ1 = 'GTTGAATCCCTAGATTTACAAACCGATGAGTCACTTTTTTGGGCGATTTAGTCCACTCGCGGGCGTGACAAGCCGAACACATCC';
      const geneJ2 = 'GTTGAATCCCTAGATTTACAAACCGATGAGTCACTTTTATGGGCGATTTAGTCCACTCGCGGGCGTGACAAGCCGAACACATCC';

      const geneK = 'ATGAATCGGGGAAACATTAATGATGAGCTCGCATTGCAAAGTTCGTTGAGCGGCCCGCTTTTGCATAGTGCTGTAAGACCCCGGAAGTGAGTA';
      const geneL = 'CGTAGGTCCTGTTGTCTACAAACTAATACCGAAGCAATTACCATTTCAGAGGAATGACATGTC';
      const geneM = 'GTGTGATCAATTTTACGAATAGGGCACCGCGCCGATGTGCCCTACGCCGGATTTGTACTAGTAGCCTTTTTGAGCTGG';
      const geneN = 'TACAAGCCCAGTAGAGTAGGGGGAGCCCTCCCTGGGACGACCACTACTACGGCCTAATTCAACTAT';

      // eslint-disable-next-line max-len
      const first = `${geneA1}${geneL}${geneB1}${geneM}${geneC1}${geneN}${geneD1}${geneK}${geneE1}${geneL}${geneF1}${geneM}${geneG1}${geneN}${geneH1}${geneK}${geneI1}${geneL}${geneJ1}`;
      // eslint-disable-next-line max-len
      const second = `${geneA2}${geneN}${geneB2}${geneK}${geneC2}${geneL}${geneD2}${geneM}${geneE2}${geneN}${geneF2}${geneK}${geneG2}${geneL}${geneH2}${geneM}${geneI2}${geneN}${geneJ2}`;

      const expectedMutations = {
        [first.indexOf(geneA1)]: {
          mutations: {
            48: {
              positionAtFirst: 48,
              positionAtSecond: 48,
              sequenceAtFirst: 'A',
              sequenceAtSecond: '',
              type: 'deletion',
            },
          },
          positionAtFirst: first.indexOf(geneA1),
          positionAtSecond: second.indexOf(geneA2),
          sequenceAtFirst: geneA1,
          sequenceAtSecond: geneA2,
        },
        [first.indexOf(geneB1)]: {
          mutations: {
            176: {
              positionAtFirst: 176,
              positionAtSecond: 178,
              sequenceAtFirst: '',
              sequenceAtSecond: 'C',
              type: 'insertion',
            },
          },
          positionAtFirst: first.indexOf(geneB1),
          positionAtSecond: second.indexOf(geneB2),
          sequenceAtFirst: geneB1,
          sequenceAtSecond: geneB2,
        },
        [first.indexOf(geneC1)]: {
          mutations: {
            330: {
              positionAtFirst: 330,
              positionAtSecond: 348,
              sequenceAtFirst: 'G',
              sequenceAtSecond: 'C',
              type: 'replacement',
            },
          },
          positionAtFirst: first.indexOf(geneC1),
          positionAtSecond: second.indexOf(geneC2),
          sequenceAtFirst: geneC1,
          sequenceAtSecond: geneC2,
        },
        [first.indexOf(geneD1)]: {
          mutations: {
            466: {
              positionAtFirst: 466,
              positionAtSecond: 481,
              sequenceAtFirst: '',
              sequenceAtSecond: 'T',
              type: 'insertion',
            },
            467: {
              positionAtFirst: 467,
              positionAtSecond: 483,
              sequenceAtFirst: '',
              sequenceAtSecond: 'G',
              type: 'insertion',
            },
            469: {
              positionAtFirst: 469,
              positionAtSecond: 486,
              sequenceAtFirst: '',
              sequenceAtSecond: 'A',
              type: 'insertion',
            },
          },
          positionAtFirst: first.indexOf(geneD1),
          positionAtSecond: second.indexOf(geneD2),
          sequenceAtFirst: geneD1,
          sequenceAtSecond: geneD2,
        },
        [first.indexOf(geneE1)]: {
          mutations: {
            641: {
              positionAtFirst: 641,
              positionAtSecond: 644,
              sequenceAtFirst: 'T',
              sequenceAtSecond: '',
              type: 'deletion',
            },
          },
          positionAtFirst: first.indexOf(geneE1),
          positionAtSecond: second.indexOf(geneE2),
          sequenceAtFirst: geneE1,
          sequenceAtSecond: geneE2,
        },
        [first.indexOf(geneF1)]: {
          mutations: {
            782: {
              positionAtFirst: 782,
              positionAtSecond: 787,
              sequenceAtFirst: '',
              sequenceAtSecond: 'C',
              type: 'insertion',
            },
          },
          positionAtFirst: first.indexOf(geneF1),
          positionAtSecond: second.indexOf(geneF2),
          sequenceAtFirst: geneF1,
          sequenceAtSecond: geneF2,
        },
        [first.indexOf(geneG1)]: {
          mutations: {
            943: {
              positionAtFirst: 943,
              positionAtSecond: 964,
              sequenceAtFirst: '',
              sequenceAtSecond: 'C',
              type: 'insertion',
            },
            944: {
              positionAtFirst: 944,
              positionAtSecond: 966,
              sequenceAtFirst: 'G',
              sequenceAtSecond: '',
              type: 'deletion',
            },
          },
          positionAtFirst: first.indexOf(geneG1),
          positionAtSecond: second.indexOf(geneG2),
          sequenceAtFirst: geneG1,
          sequenceAtSecond: geneG2,
        },
        [first.indexOf(geneH1)]: {
          mutations: {
            1085: {
              positionAtFirst: 1085,
              positionAtSecond: 1103,
              sequenceAtFirst: 'G',
              sequenceAtSecond: '',
              type: 'deletion',
            },
          },
          positionAtFirst: first.indexOf(geneH1),
          positionAtSecond: second.indexOf(geneH2),
          sequenceAtFirst: geneH1,
          sequenceAtSecond: geneH2,
        },
        [first.indexOf(geneI1)]: {
          mutations: {
            1239: {
              positionAtFirst: 1239,
              positionAtSecond: 1241,
              sequenceAtFirst: '',
              sequenceAtSecond: 'C',
              type: 'insertion',
            },
          },
          positionAtFirst: first.indexOf(geneI1),
          positionAtSecond: second.indexOf(geneI2),
          sequenceAtFirst: geneI1,
          sequenceAtSecond: geneI2,
        },
        [first.indexOf(geneJ1)]: {
          mutations: {
            1394: {
              positionAtFirst: 1394,
              positionAtSecond: 1400,
              sequenceAtFirst: '',
              sequenceAtSecond: 'A',
              type: 'insertion',
            },
            1395: {
              positionAtFirst: 1395,
              positionAtSecond: 1402,
              sequenceAtFirst: 'T',
              sequenceAtSecond: '',
              type: 'deletion',
            },
          },
          positionAtFirst: first.indexOf(geneJ1),
          positionAtSecond: second.indexOf(geneJ2),
          sequenceAtFirst: geneJ1,
          sequenceAtSecond: geneJ2,
        },
      };
      const mainKey = 'foo-main';
      const manager = new AdvancedManager(new InMemorySimpleManager(), logger);

      return findMutations(
        first,
        second,
        {
          generateRandomInteger: generateFakeIntegerFunction(),
          mainKey,
          manager,
          maxTimes: 1000,
          rootKey,
        },
      )
        .then(() => expect(manager.getComplex(mainKey)).to.eventually.deep.equal(expectedMutations));
    });
  });
}

export default testFindMutations;
