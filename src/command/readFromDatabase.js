import { AdvancedManager, LevelSimpleManager } from 'grapedb';
import LevelPromise from 'level-promise';
import _ from 'lodash';
import levelup from 'levelup';

const key = process.argv[2];
const way = process.argv[3];
const leveldbDir = process.env.DNA_LEVELDB_DIR;

const logger = {
  error: () => {},
  info: () => {},
};
const db = LevelPromise(levelup(leveldbDir));
const manager = new AdvancedManager(new LevelSimpleManager(db), logger);

(async () => {
  const result = await (async () => {
    const data = await manager.getComplex(key);
    if (way === 'allMutationsIndexesAtFirstSequence') {
      return _.flatten(_.values(data).map(alignment => Object.keys(alignment.mutations || [])));
    }

    return data;
  })();

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(result));
})();
