import _ from 'lodash';
import findExactGenes from 'dna-heuristic-aligner/findExactGenes';
import fs from 'fs';
import groupClosestSequences from 'dna-heuristic-aligner/groupClosestSequences';
import logger from 'dna-heuristic-aligner/services/logger';
import parseFNA from 'fna-parser';
import saveInArango from 'dna-heuristic-aligner/storage/saveInArango';
import sumSequencesLength from 'dna-heuristic-aligner/measurers/sumSequencesLength';

const first = parseFNA(fs.readFileSync(`${__dirname}/../data/hs_alt_CHM1_1.1_chr1.fa`).toString())[0];
const second = parseFNA(fs.readFileSync(`${__dirname}/../data/9595_ref_gorGor4_chr1.fa`).toString())[0];

const sequences = findExactGenes(first, second, { maxTimes: 1000 });
const groupedSequences = groupClosestSequences(first.sequence, second.sequence, sequences, 10);

/* eslint-disable no-console */
logger.info(`Sequences length sum: ${sumSequencesLength(sequences)}`);

const mutatedSequences = _.filter(groupedSequences, (group, key) => {
  delete groupedSequences[key];

  return group.sequenceAtFirst !== group.sequenceAtSecond;
});
saveInArango(mutatedSequences);
