import LevelPromise from 'level-promise';
import _ from 'lodash';
import levelup from 'levelup';
import logger from 'dna-heuristic-aligner/services/logger';

const saveInLevelDB = databaseDirectory => (resultsObject, additionalInfo, createDatabaseKey) => {
  const db = LevelPromise(levelup(databaseDirectory));

  return Promise.all(
    _.map(resultsObject, (object, mainKey) => Promise.all(
      _.map(Object.assign({}, additionalInfo, object), (value, objectKey) => db.put(
        createDatabaseKey(mainKey, objectKey),
        value
      ))
    ))
  )
  .then(() => logger.info(`saved ${_.size(resultsObject)} objects`))
  .catch(error => logger.error(error))
  .then(() => db.close());
};

export default saveInLevelDB;
