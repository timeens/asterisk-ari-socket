import { $log } from 'ts-log-debug';
export class AppLogger {
    static get level() {
        return process.env['DEBUG'] ? 'DEBUG' : 'INFO';
    }
    static debug(msg) {
        if (this.level === 'DEBUG')
            $log.debug(msg);
    }
    static info(msg) {
        if (this.level)
            $log.info(msg);
    }
}
