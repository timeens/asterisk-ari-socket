import { EventModel } from '../models/event.model';
import { ServerToClientEventInterface } from '../interfaces/server-to-client-event.interface';
import { RestEndpointsSip } from '../asterisk-rest/rest-endpoints-sip';


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
				this.reactToClientEvent(event);
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

	protected reactToClientEvent(event: EventModel) {
		switch (event.name) {
			case 'HANDSHAKE': {
				this.checkIfSipOnline(event.getParam('sipNr'));
				break;
			}
			case 'OUTBOUND_CALL': {
				this.newOutBoundCall();
				break;
			}
		}

	}


	protected checkIfSipOnline(sipNb) {
		new RestEndpointsSip().isSipOnline(sipNb)
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

	protected newOutBoundCall() {
		// create stasis
		// call Client Sip
		// wait client sip to pick up
		// call remote endpoint
		// send ring to client sip
		// wait for remote to pick up
		// create bridge
		// put client and remote channel into bridge
		// listen to hang ups
		// destroy channels and bridge
		// shutdown stasis
	}

}