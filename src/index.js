import _ from 'lodash';
import findMutationsWithExtendingAndLookingNear from 'dna-heuristic-aligner/findMutationsWithExtendingAndLookingNear';
import findMutationsWithJoining from 'dna-heuristic-aligner/findMutationsWithJoining';
import findMutationsWithOnlyExtending from 'dna-heuristic-aligner/findMutationsWithOnlyExtending';
import fs from 'fs';
import logger from 'dna-heuristic-aligner/services/logger';
import parseFASTA from 'fasta-to-object-parser';
import process from 'process';
import saveInLevelDB from 'dna-heuristic-aligner/storage/saveInLevelDB';
import stringSimilarity from 'string-similarity';
import sumSimilarity from 'dna-heuristic-aligner/measurers/sumSimilarity';

const dataDir = process.env.DNA_DATA_DIR;
const firstSource = process.argv[2];
const secondSource = process.argv[3];
const firstPath = process.argv[4];
const secondPath = process.argv[5];
const strategyName = process.argv[6];
const first = parseFASTA(fs.readFileSync(`${dataDir}/${firstPath}`).toString())[0];
const second = parseFASTA(fs.readFileSync(`${dataDir}/${secondPath}`).toString())[0];

const availableStrategies = {
  findMutationsWithExtendingAndLookingNear,
  findMutationsWithJoining,
  findMutationsWithOnlyExtending,
};
const strategy = availableStrategies[strategyName];

const mutatedSequences = strategy(
  first.sequence,
  second.sequence,
  {
    generateRandomInteger: () => _.random(Number.MAX_SAFE_INTEGER),
    maxTimes: 1000,
  }
);

const similarity = sumSimilarity(mutatedSequences, stringSimilarity.compareTwoStrings);
logger.info({ similarity });

const additionalInfo = {
  firstSource,
  secondSource,
  updated: new Date().toISOString(),
};
saveInLevelDB(`${__dirname}/../leveldb`)(additionalInfo.updated, { additionalInfo, mutatedSequences });
