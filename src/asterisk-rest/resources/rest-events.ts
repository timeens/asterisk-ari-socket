import { HttpRequest } from './http-request';

const ws = require('ws');
import { $log } from 'ts-log-debug';

export class RestEvents extends HttpRequest {

	endpoint = 'events';

	stasisAppWebsocket(stasisAppName) {
		let uri = `${this.eventsWebsocketUri}&app=${stasisAppName}`;
		$log.debug(`Creating Weboscket connection to ${uri}`);

		return new ws(uri);
	}

}