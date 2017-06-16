import _ from 'lodash';
import findExactGenes from 'dna-heuristic-aligner/findExactGenes';
import fs from 'fs';
import groupClosestSequences from 'dna-heuristic-aligner/groupClosestSequences';
import logger from 'dna-heuristic-aligner/services/logger';
import parseFNA from 'fna-parser';
import process from 'process';
import saveInLevelDB from 'dna-heuristic-aligner/storage/saveInLevelDB';
import sumSequencesLength from 'dna-heuristic-aligner/measurers/sumSequencesLength';

const firstSource = process.argv[2];
const secondSource = process.argv[3];
const firstPath = process.argv[4];
const secondPath = process.argv[5];
const first = parseFNA(fs.readFileSync(`${__dirname}/../data/${firstPath}`).toString())[0];
const second = parseFNA(fs.readFileSync(`${__dirname}/../data/${secondPath}`).toString())[0];

const sequences = findExactGenes(first, second, { maxTimes: 1000 });
const groupedSequences = groupClosestSequences(first.sequence, second.sequence, sequences, 10);

/* eslint-disable no-console */
logger.info(`Sequences length sum: ${sumSequencesLength(sequences)}`);

const mutatedSequencesAsArray = _.filter(groupedSequences, (group, key) => {
  delete groupedSequences[key];

  return Math.abs(Math.log(group.sequenceAtFirst.length / group.sequenceAtSecond.length)) < 0.5 &&
    group.sequenceAtFirst !== group.sequenceAtSecond;
});
const mutatedSequences = _.zipObject(
  mutatedSequencesAsArray.map(alignment => alignment.positionAtFirst),
  mutatedSequencesAsArray
);
const additionalInfo = {
  firstSource,
  secondSource,
  updated: new Date().toISOString(),
};
const createDatabaseKey = (mainKey, objectKey) => JSON.stringify({
  firstSource,
  mainKey,
  objectKey,
  secondSource,
});
saveInLevelDB(`${__dirname}/../leveldb`)(mutatedSequences, additionalInfo, createDatabaseKey);
