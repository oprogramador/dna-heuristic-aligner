import bunyan from 'bunyan';
import info from '../../package';

const logger = bunyan.createLogger({ name: info.name });

export default logger;
