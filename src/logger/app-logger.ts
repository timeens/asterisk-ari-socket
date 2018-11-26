import { $log } from 'ts-log-debug';

export class AppLogger {

	public static get level() {
		return process.env['DEBUG'] ? 'DEBUG' : 'INFO';
	}

	public static debug(msg) {
		if (this.level === 'DEBUG') $log.debug(msg);
	}

	public static info(msg) {
		if (this.level) $log.info(msg);
	}
}