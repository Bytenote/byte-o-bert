import winston from 'winston';
import config from '@byte-o-bert/config';
import { getRelativePath } from './utils/helpers.js';

const { combine, label, prettyPrint, timestamp } = winston.format;
const { File, Console } = winston.transports;

/**
 * @class LogService
 * @description Responsible for logging
 *
 * @property {Object} #logger - Winston logger
 */
class LogService {
	#logger;

	constructor() {
		this.#logger = winston.createLogger({
			level: config.logging.level ?? 'info',
			format: combine(
				label({ label: 'dc-bot' }),
				timestamp({
					format: 'YYYY-MM-DD HH:mm:ss',
				}),
				prettyPrint()
			),
			transports: [
				new Console(),
				new File({
					level: 'error',
					filename: `${config.logging.dir}/error.log`,
				}),
				new File({
					level: 'warn',
					filename: `${config.logging.dir}/warn.log`,
					format: winston.format((info) =>
						info.level === 'warn' ? info : false
					)(),
				}),
			],
			exceptionHandlers: [
				new File({
					filename: `${config.logging.dir}/exceptions.log`,
				}),
			],
			rejectionHandlers: [
				new File({
					filename: `${config.logging.dir}/rejections.log`,
				}),
			],
		});
	}

	error(message, meta = {}) {
		this.#log('error', message, meta);
	}

	warn(message, meta = {}) {
		this.#log('warn', message, meta);
	}

	info(message, meta = {}) {
		this.#log('info', message, meta);
	}

	verbose(message, meta = {}) {
		this.#log('verbose', message, meta);
	}

	debug(message, meta = {}) {
		this.#log('debug', message, meta);
	}

	/**
	 * Logs a message with the specified log level
	 * and optional meta data
	 * @private
	 *
	 * @param {string} level	- Log level
	 * @param {string} message	- Message to log
	 * @param {Object} [meta]	- Optional meta data
	 */
	#log(level, message, meta = {}) {
		if ('origin' in meta) {
			// convert origin to cross-platform relative path
			meta = { ...meta, origin: getRelativePath(meta.origin) };
		}

		this.#logger.log({
			level,
			message,
			...(Object.keys(meta).length > 0 && { meta }),
		});
	}
}

export default new LogService();
