import { AdvancedManager, LevelSimpleManager } from 'grapedb';
import LevelPromise from 'level-promise';
import levelup from 'levelup';

const key = process.argv[2];
const leveldbDir = process.env.DNA_LEVELDB_DIR;

const logger = {
  error: () => {},
  info: () => {},
};
const db = LevelPromise(levelup(leveldbDir));
const manager = new AdvancedManager(new LevelSimpleManager(db), logger);

(async () => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(await manager.getComplex(key)));
})();
