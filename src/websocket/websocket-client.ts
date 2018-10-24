import { WebsocketClientBase } from './websocket-client-base';
import { EventModel } from '../models/event.model';


export class WebsocketClient extends WebsocketClientBase {

	constructor(socket) {
		super(socket);
		this.listenToClient();
	}

	listenToClient() {
		this.serverToClientSocket.on('message', (msg: string) => {
			let event = new EventModel(msg);
			if (event.isValid) {
				this.reactToClientEvent(event);
			} else {
				this.sendError(event.errorCode);
			}
		});
	}

	protected async reactToClientEvent(event: EventModel) {
		switch (event.name) {
			case 'HANDSHAKE': {
				await this.checkIfSipOnline(event.getParam('sipNr'));
				this.sendEvent({name:'wefew'});
				break;
			}
			case 'OUTBOUND_CALL': {
				this.newOutBoundCall();
				break;
			}
		}
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


	protected async checkIfSipOnline(sipNb) {
		await this.ariRest.restEndpointSip.isSipOnline(sipNb) ? this.sendEvent({name: 'READY'}) : this.sendError('SIP_UNAVAILABLE');
	}
}