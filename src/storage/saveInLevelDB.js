import LevelPromise from 'level-promise';
import _ from 'lodash';
import levelup from 'levelup';
import logger from 'dna-heuristic-aligner/services/logger';
import uuid from 'uuid';

/* eslint-disable no-use-before-define */

const getType = (value) => {
  if (value === null) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return 'array';
  }

  return typeof value;
};

const saveSimpleValue = (db, key, value) => {
  const type = getType(value);
  const valueToSave = ['object', 'array'].includes(type) ? JSON.stringify(value) : value;

  return db.put(key, `${type}:${valueToSave}`)
    .then(() => logger.info(`saved ${key}`));
};

const saveArray = (db, key, value) => {
  const ids = value.map(() => uuid.v4());

  return Promise.all([
    saveSimpleValue(db, key, ids),
    ...ids.map((id, i) => saveAny(db, id, value[i])),
  ]);
};

const saveObject = (db, key, value) => {
  const ids = _.mapValues(value, () => uuid.v4());

  return Promise.all([
    saveSimpleValue(db, key, ids),
    ..._.map(ids, (id, innerKey) => saveAny(db, id, value[innerKey])),
  ]);
};

const saveAny = (db, key, value) => {
  const type = getType(value);
  if (type === 'array') {
    return saveArray(db, key, value);
  }
  if (type === 'object') {
    return saveObject(db, key, value);
  }

  return saveSimpleValue(db, key, value);
};

const saveInLevelDB = databaseDirectory => (key, value) => {
  const db = LevelPromise(levelup(databaseDirectory));
  const rootKey = 'root';

  return db.get(rootKey)
    .catch((error) => {
      if (error instanceof levelup.errors.NotFoundError) {
        return 'array:[]';
      }

      throw error;
    })
    .then(root => JSON.parse(root.replace(/^array:/, '')))
    .then(root => saveSimpleValue(db, rootKey, [...root, key]))
    .then(() => saveAny(db, key, value))
    .then(() => db.close())
    .catch(error => logger.error(error));
};

export default saveInLevelDB;
