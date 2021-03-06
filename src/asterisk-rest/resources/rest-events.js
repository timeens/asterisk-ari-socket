import { HttpRequest } from './http-request';
import { AppLogger } from '../../logger/app-logger';
const ws = require('ws');
export class RestEvents extends HttpRequest {
    constructor() {
        super(...arguments);
        this.endpoint = 'events';
    }
    stasisAppWebsocket(stasisAppName) {
        let uri = `${this.eventsWebsocketUri}&app=${stasisAppName}`;
        AppLogger.debug(`Creating websocket connection to ${uri}`);
        return new ws(uri);
    }
}
