import expect from 'dna-heuristic-aligner/tests/expect';

function testExtending({ findEnd, findStart }) {
  describe('extending', () => {
    describe('.findEnd', () => {
      it('finds end for no mutation', () => {
        const geneA1 = 'GAGGGATCTACCGGCCCCGTACAATAC';
        const geneA2 = geneA1;

        const geneK = 'ACATCCATTTGCATGGAA';
        const geneL = 'GGCATAGAGGTGCGGAGCGCGGAT';
        const geneM = 'TCTATCGATTCTCTCCGTGCT';
        const geneN = 'CTAGTAGGAACTTGT';

        const first = `${geneK}${geneA1}${geneL}`;
        const second = `${geneM}${geneA2}${geneN}`;

        const {
          positionAtFirst,
          positionAtSecond,
          shift,
        } = findEnd(first, second, geneK.length + 3, geneM.length + 3);

        expect(shift).to.equal(geneA1.length - 4);
        expect(positionAtFirst).to.equal(first.indexOf(geneL) - 1);
        expect(positionAtSecond).to.equal(second.indexOf(geneN) - 1);
      });

      it('finds end for deletion', () => {
        const geneA1 = 'ATAGGATTGTATGTAGATCAGTGTGACCTCGCTATTGCCCCG';
        const geneA2 = 'ATAGGATTGTATGTAGATCAGTGGACCTCGCTATTGCCCCG';

        const geneK = 'ACATCCATTTGCATGGAA';
        const geneL = 'GGCATAGAGGTGCGGAGCGCGGAT';
        const geneM = 'TCTATCGATTCTCTCCGTGCT';
        const geneN = 'CTAGTAGGAACTTGT';

        const first = `${geneK}${geneA1}${geneL}`;
        const second = `${geneM}${geneA2}${geneN}`;

        const {
          positionAtFirst,
          positionAtSecond,
          shift,
        } = findEnd(first, second, geneK.length + 3, geneM.length + 3);

        expect(shift).to.equal(geneA1.length - 4);
        expect(positionAtFirst).to.equal(first.indexOf(geneL) - 1);
        expect(positionAtSecond).to.equal(second.indexOf(geneN) - 1);
      });

      it('finds end for insertion', () => {
        const geneA1 = 'TTGGTTTCAACCGTGCGTCCAAATTGGAGATAGGGTCTTTAT';
        const geneA2 = 'TTGGTTTCAACCGTGCGTCCAAATTGAGAGATAGGGTCTTTAT';

        const geneK = 'ACATCCATTTGCATGGAA';
        const geneL = 'GGCATAGAGGTGCGGAGCGCGGAT';
        const geneM = 'TCTATCGATTCTCTCCGTGCT';
        const geneN = 'CTAGTAGGAACTTGT';

        const first = `${geneK}${geneA1}${geneL}`;
        const second = `${geneM}${geneA2}${geneN}`;

        const {
          positionAtFirst,
          positionAtSecond,
          shift,
        } = findEnd(first, second, geneK.length + 3, geneM.length + 3);

        expect(shift).to.equal(geneA1.length - 4);
        expect(positionAtFirst).to.equal(first.indexOf(geneL) - 1);
        expect(positionAtSecond).to.equal(second.indexOf(geneN) - 1);
      });

      it('finds end for replacement', () => {
        const geneA1 = 'GAACCAAGAACCACCGGTCACATGCAGCTCGACAGTTATTGA';
        const geneA2 = 'GAACCAAGAACCACCGGTCACATGAAGCTCGACAGTTATTGA';

        const geneK = 'ACATCCATTTGCATGGAA';
        const geneL = 'GGCATAGAGGTGCGGAGCGCGGAT';
        const geneM = 'TCTATCGATTCTCTCCGTGCT';
        const geneN = 'ATAGTCCGTAGCGTT';

        const first = `${geneK}${geneA1}${geneL}`;
        const second = `${geneM}${geneA2}${geneN}`;

        const {
          positionAtFirst,
          positionAtSecond,
          shift,
        } = findEnd(first, second, geneK.length + 3, geneM.length + 3);

        expect(shift).to.equal(geneA1.length - 4);
        expect(positionAtFirst).to.equal(first.indexOf(geneL) - 1);
        expect(positionAtSecond).to.equal(second.indexOf(geneN) - 1);
      });

      it('finds end for duplication', () => {
        const geneA1 = 'AAAGTCCGACAGAGTTTTATGAATGATTCCCAAATTCAAAAC';
        const geneA2 = 'AAAGTCCGACAGAGTTTTATGAATGATGATTCCCAAATTCAAAAC';

        const geneK = 'ACATCCATTTGCATGGAA';
        const geneL = 'GGCATAGAGGTGCGGAGCGCGGAT';
        const geneM = 'TCTATCGATTCTCTCCGTGCT';
        const geneN = 'ACCCCCGAGAGGAAT';

        const first = `${geneK}${geneA1}${geneL}`;
        const second = `${geneM}${geneA2}${geneN}`;

        const {
          positionAtFirst,
          positionAtSecond,
          shift,
        } = findEnd(first, second, geneK.length + 3, geneM.length + 3);

        expect(shift).to.equal(geneA1.length - 4);
        expect(positionAtFirst).to.equal(first.indexOf(geneL) - 1);
        expect(positionAtSecond).to.equal(second.indexOf(geneN) - 1);
      });
    });

    describe('.findStart', () => {
      it('finds start for no mutation', () => {
        const geneA1 = 'GAGGGATCTACCGGCCCCGTACAATAC';
        const geneA2 = geneA1;

        const geneK = 'ACATCCATTTGCATGGAA';
        const geneL = 'GGCATAGAGGTGCGGAGCGCGGAT';
        const geneM = 'TCTATCGATTCTCTCCGTGCT';
        const geneN = 'CATTGCGTACCTGTC';

        const first = `${geneK}${geneA1}${geneL}`;
        const second = `${geneM}${geneA2}${geneN}`;

        const {
          positionAtFirst,
          positionAtSecond,
          shift,
        } = findStart(first, second, geneK.length + 3, geneM.length + 3);

        expect(shift).to.equal(3);
        expect(positionAtFirst).to.equal(geneK.length);
        expect(positionAtSecond).to.equal(geneM.length);
      });

      it('finds start for deletion', () => {
        const geneA1 = 'ATAGGATTGTATGTAGATCAGTGTGACCTCGCTATTGCCCCG';
        const geneA2 = 'ATAGGATTGTATGTAGATCAGTGGACCTCGCTATTGCCCCG';

        const geneK = 'ACATCCATTTGCATGGAA';
        const geneL = 'GGCATAGAGGTGCGGAGCGCGGAT';
        const geneM = 'TCTATCGATTCTCTCCGTGCT';
        const geneN = 'CATTGCGTACCTGTC';

        const first = `${geneK}${geneA1}${geneL}`;
        const second = `${geneM}${geneA2}${geneN}`;

        const {
          positionAtFirst,
          positionAtSecond,
          shift,
        } = findStart(first, second, geneK.length + 3, geneM.length + 3);

        expect(shift).to.equal(3);
        expect(positionAtFirst).to.equal(geneK.length);
        expect(positionAtSecond).to.equal(geneM.length);
      });

      it('finds start for insertion', () => {
        const geneA1 = 'TTGGTTTCAACCGTGCGTCCAAATTGGAGATAGGGTCTTTAT';
        const geneA2 = 'TTGGTTTCAACCGTGCGTCCAAATTGAGAGATAGGGTCTTTAT';

        const geneK = 'ACATCCATTTGCATGGAA';
        const geneL = 'GGCATAGAGGTGCGGAGCGCGGAT';
        const geneM = 'TCTATCGATTCTCTCCGTGCT';
        const geneN = 'CCAGATAAGCGGCGG';

        const first = `${geneK}${geneA1}${geneL}`;
        const second = `${geneM}${geneA2}${geneN}`;

        const {
          positionAtFirst,
          positionAtSecond,
          shift,
        } = findStart(first, second, geneK.length + 3, geneM.length + 3);

        expect(shift).to.equal(3);
        expect(positionAtFirst).to.equal(geneK.length);
        expect(positionAtSecond).to.equal(geneM.length);
      });

      it('finds start for replacement', () => {
        const geneA1 = 'GAACCAAGAACCACCGGTCACATGCAGCTCGACAGTTATTGA';
        const geneA2 = 'GAACCAAGAACCACCGGTCACATGAAGCTCGACAGTTATTGA';

        const geneK = 'ACATCCATTTGCATGGAA';
        const geneL = 'GGCATAGAGGTGCGGAGCGCGGAT';
        const geneM = 'TCTATCGATTCTCTCCGTGCT';
        const geneN = 'GTAGCTCTGAATTGC';

        const first = `${geneK}${geneA1}${geneL}`;
        const second = `${geneM}${geneA2}${geneN}`;

        const {
          positionAtFirst,
          positionAtSecond,
          shift,
        } = findStart(first, second, geneK.length + 3, geneM.length + 3);

        expect(shift).to.equal(3);
        expect(positionAtFirst).to.equal(geneK.length);
        expect(positionAtSecond).to.equal(geneM.length);
      });

      it('finds start for duplication', () => {
        const geneA1 = 'AAAGTCCGACAGAGTTTTATGAATGATTCCCAAATTCAAAAC';
        const geneA2 = 'AAAGTCCGACAGAGTTTTATGAATGATGATTCCCAAATTCAAAAC';

        const geneK = 'ACATCCATTTGCATGGAA';
        const geneL = 'GGCATAGAGGTGCGGAGCGCGGAT';
        const geneM = 'TCTATCGATTCTCTCCGTGCT';
        const geneN = 'CAAAGGTGCCAGCAG';

        const first = `${geneK}${geneA1}${geneL}`;
        const second = `${geneM}${geneA2}${geneN}`;

        const {
          positionAtFirst,
          positionAtSecond,
          shift,
        } = findStart(first, second, geneK.length + 3, geneM.length + 3);

        expect(shift).to.equal(3);
        expect(positionAtFirst).to.equal(geneK.length);
        expect(positionAtSecond).to.equal(geneM.length);
      });
    });
  });
}

export default testExtending;
