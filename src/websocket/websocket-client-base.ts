import { ServerToClientEventInterface } from '../interfaces/server-to-client-event.interface';
import { EventModel } from '../models/event.model';
import { AriRest } from '../asterisk-rest/ari-rest';

export abstract class WebsocketClientBase {

	serverToClientSocket: any;
	clientIp: String;
	ariRest: AriRest;

	constructor(socket) {
		this.serverToClientSocket = socket;
		this.clientIp = socket._socket.remoteAddress;
		this.ariRest = new AriRest();
	}

	protected sendError(errorCode) {
		let res = {name: 'ERROR', errorCode: errorCode};
		this.serverToClientSocket.send(JSON.stringify(res));
	}

	protected sendEvent(event: ServerToClientEventInterface) {
		this.serverToClientSocket.send(JSON.stringify(event));
	}
}