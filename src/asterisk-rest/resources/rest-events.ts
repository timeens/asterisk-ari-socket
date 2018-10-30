import { HttpRequest } from './http-request';
import { AppLogger } from '../../logger/app-logger';

const ws = require('ws');

export class RestEvents extends HttpRequest {

	endpoint = 'events';

	stasisAppWebsocket(stasisAppName) {
		let uri = `${this.eventsWebsocketUri}&app=${stasisAppName}`;
		AppLogger.debug(`Creating Weboscket connection to ${uri}`);

		return new ws(uri);
	}

}