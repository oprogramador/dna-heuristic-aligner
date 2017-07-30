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
          positionAtFirst: first.indexOf(geneA1),
          positionAtSecond: second.indexOf(geneA2),
          sequenceAtFirst: geneA1,
          sequenceAtSecond: geneA2,
        },
        [first.indexOf(geneB1)]: {
          positionAtFirst: first.indexOf(geneB1),
          positionAtSecond: second.indexOf(geneB2),
          sequenceAtFirst: geneB1,
          sequenceAtSecond: geneB2,
        },
        [first.indexOf(geneC1)]: {
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
          positionAtFirst: first.indexOf(geneA1),
          positionAtSecond: second.indexOf(geneA2),
          sequenceAtFirst: geneA1,
          sequenceAtSecond: geneA2,
        },
        [first.indexOf(geneB1)]: {
          positionAtFirst: first.indexOf(geneB1),
          positionAtSecond: second.indexOf(geneB2),
          sequenceAtFirst: geneB1,
          sequenceAtSecond: geneB2,
        },
        [first.indexOf(geneC1)]: {
          positionAtFirst: first.indexOf(geneC1),
          positionAtSecond: second.indexOf(geneC2),
          sequenceAtFirst: geneC1,
          sequenceAtSecond: geneC2,
        },
        [first.indexOf(geneD1)]: {
          positionAtFirst: first.indexOf(geneD1),
          positionAtSecond: second.indexOf(geneD2),
          sequenceAtFirst: geneD1,
          sequenceAtSecond: geneD2,
        },
        [first.indexOf(geneE1)]: {
          positionAtFirst: first.indexOf(geneE1),
          positionAtSecond: second.indexOf(geneE2),
          sequenceAtFirst: geneE1,
          sequenceAtSecond: geneE2,
        },
        [first.indexOf(geneF1)]: {
          positionAtFirst: first.indexOf(geneF1),
          positionAtSecond: second.indexOf(geneF2),
          sequenceAtFirst: geneF1,
          sequenceAtSecond: geneF2,
        },
        [first.indexOf(geneG1)]: {
          positionAtFirst: first.indexOf(geneG1),
          positionAtSecond: second.indexOf(geneG2),
          sequenceAtFirst: geneG1,
          sequenceAtSecond: geneG2,
        },
        [first.indexOf(geneH1)]: {
          positionAtFirst: first.indexOf(geneH1),
          positionAtSecond: second.indexOf(geneH2),
          sequenceAtFirst: geneH1,
          sequenceAtSecond: geneH2,
        },
        [first.indexOf(geneI1)]: {
          positionAtFirst: first.indexOf(geneI1),
          positionAtSecond: second.indexOf(geneI2),
          sequenceAtFirst: geneI1,
          sequenceAtSecond: geneI2,
        },
        [first.indexOf(geneJ1)]: {
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
