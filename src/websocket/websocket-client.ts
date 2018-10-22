import { EventModel } from '../models/event.model';
import { ServerToClientEventInterface } from '../interfaces/server-to-client-event.interface';
import { RestEndpoints } from '../asterisk-rest/rest-endpoints';


export class WebsocketClient {

	serverToClientSocket: any;

	constructor(socket) {
		this.serverToClientSocket = socket;
		this.listen();
	}


	listen() {
		this.serverToClientSocket.on('message', (msg: string) => {
			let event = new EventModel(msg);
			if (event.isValid) {
				this.reactToEvent(event);
			} else {
				this.sendError(event.errorCode);
			}
		});
	}

	protected sendError(errorCode) {
		let res = {name: 'ERROR', errorCode: errorCode};
		this.serverToClientSocket.send(JSON.stringify(res));
	}

	protected sendEvent(event: ServerToClientEventInterface) {
		this.serverToClientSocket.send(JSON.stringify(event));
	}

	protected reactToEvent(event: EventModel) {
		switch (event.name) {
			case 'HANDSHAKE': {
				this.checkIfSipOnline(event.getParam('sipNr'));
			}
		}

	}


	protected checkIfSipOnline(sipNb) {
		new RestEndpoints().isSipOnline(sipNb)
			.then(isOnline => {
				if (isOnline) {
					this.sendEvent({name: 'READY'});
				} else {
					this.sendError('SIP_UNAVAILABLE');
				}
			})
			.catch(err => {
				this.sendError(err.errorCode);
			});
	}

}