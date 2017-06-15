import LevelPromise from 'level-promise';
import expect from 'dna-heuristic-aligner/tests/expect';
import levelup from 'levelup';
import rimraf from 'rimraf';
import saveInLevelDB from 'dna-heuristic-aligner/storage/saveInLevelDB';

const testDbDirectory = `${__dirname}/../../../../leveldb-test`;

describe('saveInLevelDB', () => {
  beforeEach('remove test database', () => rimraf.sync(testDbDirectory));

  it('saves all keys', () => {
    const objects = {
      foo1: {
        bar: 'bar-value',
        baz: 'baz-value',
        foo: 'foo-value',
      },
      foo2: {
        bar: 'bar-value-2',
        baz: 'baz-value-2',
        foo: 'foo-value-2',
      },
    };
    const additionalInfo = {
      created: '2016-01-01',
      updated: '2017-02-15',
    };
    const createDatabaseKey = (mainKey, objectKey) => JSON.stringify({ mainKey, objectKey, serie: 123 });

    return saveInLevelDB(testDbDirectory)(objects, additionalInfo, createDatabaseKey)
      .then(() => {
        const db = LevelPromise(levelup(testDbDirectory));

        return Promise.all([
          expect(db.get(JSON.stringify({ mainKey: 'foo1', objectKey: 'foo', serie: 123 })))
            .to.eventually.equal('foo-value'),
          expect(db.get(JSON.stringify({ mainKey: 'foo1', objectKey: 'bar', serie: 123 })))
            .to.eventually.equal('bar-value'),
          expect(db.get(JSON.stringify({ mainKey: 'foo1', objectKey: 'baz', serie: 123 })))
            .to.eventually.equal('baz-value'),
          expect(db.get(JSON.stringify({ mainKey: 'foo1', objectKey: 'created', serie: 123 })))
            .to.eventually.equal('2016-01-01'),
          expect(db.get(JSON.stringify({ mainKey: 'foo1', objectKey: 'updated', serie: 123 })))
            .to.eventually.equal('2017-02-15'),
          expect(db.get(JSON.stringify({ mainKey: 'foo2', objectKey: 'foo', serie: 123 })))
            .to.eventually.equal('foo-value-2'),
          expect(db.get(JSON.stringify({ mainKey: 'foo2', objectKey: 'bar', serie: 123 })))
            .to.eventually.equal('bar-value-2'),
          expect(db.get(JSON.stringify({ mainKey: 'foo2', objectKey: 'baz', serie: 123 })))
            .to.eventually.equal('baz-value-2'),
          expect(db.get(JSON.stringify({ mainKey: 'foo2', objectKey: 'created', serie: 123 })))
            .to.eventually.equal('2016-01-01'),
          expect(db.get(JSON.stringify({ mainKey: 'foo2', objectKey: 'updated', serie: 123 })))
            .to.eventually.equal('2017-02-15'),
        ]);
      });
  });
});
