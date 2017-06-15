import _ from 'lodash';
import arangoErrorCodes from 'arangodb-error-codes';
import arangojs from 'arangojs';
import logger from 'dna-heuristic-aligner/services/logger';

const handleDuplicateName = error => (
  error.errorNum === arangoErrorCodes.ERROR_ARANGO_DUPLICATE_NAME
    ? Promise.resolve()
    : Promise.reject(error)
);

const databaseName = 'dna';

function saveInArango(resultsObject) {
  const db = arangojs({ databaseName: '_system', url: 'http://root:root@localhost:8530' });

  const query = `
  UPSERT { _id: @key }
  INSERT @value
  UPDATE @value
  IN alignments
  `;

  return db.createDatabase(databaseName)
    .catch(handleDuplicateName)
    .then(() => db.useDatabase(databaseName))
    .then(() => db.collection('alignments').create())
    .catch(handleDuplicateName)
    .then(() => _.map(resultsObject, (value, key) => db.query(query, { key, value })))
    .then(() => logger.info(`saved ${_.size(resultsObject)} objects`))
    .catch(error => logger.error(error));
}

export default saveInArango;
