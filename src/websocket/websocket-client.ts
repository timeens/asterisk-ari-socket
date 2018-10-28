import { WebsocketClientBase } from './websocket-client-base';
import { EventModel } from '../models/event.model';
import { OutboundCall } from './outbound-call';


export class WebsocketClient extends WebsocketClientBase {

	clientSipId: number;
	outboundCall: OutboundCall = null;

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
				this.sendError(event.errors);
			}
		});

		this.serverToClientSocket.on('close', () => {
			this.outboundCall.hangUp();
		})
		// todo client close socket event
	}

	protected async reactToClientEvent(event: EventModel) {
		switch (event.name) {
			case 'HANDSHAKE': {
				this.clientSipId = event.getParam('sipNr');
				await this.ariRest.restEndpointSip.isSipOnline(this.clientSipId) ? this.sendEvent({name: 'READY'}) : this.sendError([{code: 'SIP_UNAVAILABLE'}]);
				break;
			}
			case 'OUTBOUND_CALL': {
				let remoteEndpoint = event.getParam('remoteEndpoint');
				this.outboundCall = new OutboundCall(this, remoteEndpoint);
				break;
			}
			case 'HANGUP': {
				if(!this.outboundCall || !this.outboundCall.canHangUp()) return this.sendError([{code:'HANG_UP_NO_ACTIVE_CALL'}]);
				this.outboundCall.hangUp();
			}
		}
	}
}