import _ from 'lodash';
import findMutationsWithJoining from 'dna-heuristic-aligner/findMutationsWithJoining';
import findMutationsWithOnlyExtending from 'dna-heuristic-aligner/findMutationsWithOnlyExtending';
import fs from 'fs';
import parseFNA from 'fna-parser';
import process from 'process';
import saveInLevelDB from 'dna-heuristic-aligner/storage/saveInLevelDB';

const firstSource = process.argv[2];
const secondSource = process.argv[3];
const firstPath = process.argv[4];
const secondPath = process.argv[5];
const strategyName = process.argv[6];
const first = parseFNA(fs.readFileSync(`${__dirname}/../data/${firstPath}`).toString())[0];
const second = parseFNA(fs.readFileSync(`${__dirname}/../data/${secondPath}`).toString())[0];

const availableStrategies = {
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
