import { AdvancedManager, LevelSimpleManager } from 'grapedb';
import LevelPromise from 'level-promise';
import _ from 'lodash';
import findMutationsWithOnlyExtending from 'dna-heuristic-aligner/findMutationsWithOnlyExtending';
import fs from 'fs';
import levelup from 'levelup';
import logger from 'dna-heuristic-aligner/services/logger';
import parseFASTA from 'fasta-to-object-parser';
import process from 'process';

const dataDir = process.env.DNA_DATA_DIR;
const firstPath = process.argv[4];
const secondPath = process.argv[5];
const strategyName = process.argv[6];
const first = parseFASTA(fs.readFileSync(`${dataDir}/${firstPath}`).toString())[0];
const second = parseFASTA(fs.readFileSync(`${dataDir}/${secondPath}`).toString())[0];

const availableStrategies = {
  findMutationsWithOnlyExtending,
};
const strategy = availableStrategies[strategyName];

const db = LevelPromise(levelup(`${__dirname}/../leveldb`));
const simpleManager = new LevelSimpleManager(db);
const manager = new AdvancedManager(simpleManager, { error: logger.error, info: () => {} });
const mainKey = new Date().toISOString();
const rootKey = 'root';
strategy(
  first.sequence,
  second.sequence,
  {
    generateRandomInteger: () => _.random(Number.MAX_SAFE_INTEGER),
    mainKey,
    manager,
    maxTimes: 20000,
    rootKey,
  }
)
  .then(() => logger.info({ mainKey }));
