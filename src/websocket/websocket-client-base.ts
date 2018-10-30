import { ServerToClientEventInterface } from '../interfaces/server-to-client-event.interface';
import { AriRest } from '../asterisk-rest/ari-rest';
import { ErrorInterface } from '../interfaces/error.interface';

export abstract class WebsocketClientBase {

	serverToClientSocket: any;
	clientIp: String;
	ariRest: AriRest;

	constructor(socket) {
		this.serverToClientSocket = socket;
		this.clientIp = socket._socket.remoteAddress;
		this.ariRest = new AriRest();
	}

	sendError(errors: Array<ErrorInterface>) {
		let res = {name: 'ERROR', errors: errors};
		this.serverToClientSocket.send(JSON.stringify(res));
	}

	sendEvent(event: ServerToClientEventInterface) {
		this.serverToClientSocket.send(JSON.stringify(event));
	}
}