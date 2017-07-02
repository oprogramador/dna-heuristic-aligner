import chai, { expect } from 'chai';
import { WARN } from 'bunyan';
import chaiAsPromised from 'chai-as-promised';
import chaiString from 'chai-string';
import chaiSubset from 'chai-subset';
import dirtyChai from 'dirty-chai';
import logger from 'dna-heuristic-aligner/services/logger';
import sinonChai from 'sinon-chai';

logger.level(WARN);

chai.use(chaiString);
chai.use(chaiSubset);
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(dirtyChai);

export default expect;
