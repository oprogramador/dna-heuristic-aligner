import { AdvancedManager, LevelSimpleManager } from 'grapedb';
import LevelPromise from 'level-promise';
import _ from 'lodash';
import findMutationsInsideAlignment from 'dna-heuristic-aligner/findMutationsInsideAlignment';
import findMutationsWithExtendingAndLookingNear from 'dna-heuristic-aligner/findMutationsWithExtendingAndLookingNear';
import findMutationsWithJoining from 'dna-heuristic-aligner/findMutationsWithJoining';
import findMutationsWithOnlyExtending from 'dna-heuristic-aligner/findMutationsWithOnlyExtending';
import fs from 'fs';
import levelup from 'levelup';
import logger from 'dna-heuristic-aligner/services/logger';
import parseFASTA from 'fasta-to-object-parser';
import process from 'process';
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
    maxTimes: 10000,
  }
);
_.map(mutatedSequences, (sequence) => {
  sequence.exactMutations = findMutationsInsideAlignment(sequence);
});
const allExactMutations = Object.assign(
  {},
  ..._.map(mutatedSequences, sequence => sequence.exactMutations)
);


const additionalInfo = {
  firstSource,
  secondSource,
  updated: new Date().toISOString(),
};
const toSave = { additionalInfo, allExactMutations, mutatedSequences };
const db = LevelPromise(levelup(`${__dirname}/../leveldb`));
new AdvancedManager(new LevelSimpleManager(db), logger).set(additionalInfo.updated, toSave)
  .then(() => db.close())
  .then(() => {
    const similarity = sumSimilarity(mutatedSequences, stringSimilarity.compareTwoStrings);
    logger.info(`saved as ${additionalInfo.updated}`);
    logger.info({ similarity });
    logger.info(`Found ${Object.keys(allExactMutations).length} mutations in ${_.size(mutatedSequences)} sequences.`);
  });
