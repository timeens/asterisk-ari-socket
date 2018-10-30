import { WebsocketClientBase } from './websocket-client-base';
import { EventModel } from '../models/event.model';
import { OutboundCall } from './outbound-call';
import { AppLogger } from '../logger/app-logger';
import { PhoneNumber } from '../models/PhoneNumber';


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
			if (this.outboundCall) this.outboundCall.hangUpClient();
			AppLogger.info("Client disconnected");
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
				if (this.callInProgress) return this.sendError([{code: 'CALL_IN_PROGRESS'}]);
				let remoteEndpoint = event.getParam('remoteEndpoint');
				let displayName = event.getParam('displayName');
				let phoneNumber = new PhoneNumber(remoteEndpoint);
				if (!phoneNumber.isValid) return this.sendError([{code: 'INVALID_REMOTE_NUMBER', data: phoneNumber.rawNumber}]);
				this.outboundCall = new OutboundCall(this, phoneNumber, displayName);
				break;
			}
			case 'HANGUP': {
				if (!this.callInProgress) return this.sendError([{code: 'HANG_UP_NO_ACTIVE_CALL'}]);
				await this.outboundCall.hangUpClient();
				this.outboundCall = null;
			}
		}
	}


	private get callInProgress(): boolean {
		return this.outboundCall && this.outboundCall.inProgress;
	}
}