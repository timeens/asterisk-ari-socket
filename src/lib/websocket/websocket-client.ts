import { RestEndpoints } from '../asterisk-rest/rest-endpoints';
import { WebsocketClientEventInterface } from '../../interfaces/websocket-client-event.interface';
import { WebsocketServerEventInterface } from '../../interfaces/websocket-server-event.interface';

export class WebsocketClient {

	clientSocket: any;

	constructor(socket) {
		this.clientSocket = socket;
		this.listen();
	}


	listen() {
		this.clientSocket.on('message', (event: string) => {
			this.onMessage(this.parseJson(event));
		});
		this.clientSocket.on('close', (event: string) => {
			this.onClose(this.parseJson(event));
		});
	}

	protected onMessage(event: WebsocketClientEventInterface) {
		this.reactToEvent(event);
	}

	protected onClose(event: WebsocketClientEventInterface) {
	}

	protected reactToEvent(event: WebsocketClientEventInterface) {
		switch (event.type) {
			case 'HANDSHAKE':
				this.checkIfSipOnline();
				break;
			case 'OUTBOUND_CALL':
				// todo call someone
				break;
			case 'ANSWER_INBOUND_CALL':
				// todo answer a pending inbound call
				break;
		}
	}

	protected parseJson(jsonString: string): WebsocketClientEventInterface {
		// validate json
		return JSON.parse(jsonString);
	}

	protected sendEvent(event: WebsocketServerEventInterface) {
		event.isBroadcast = false;
		this.clientSocket.send(JSON.stringify(event));
	}


	protected checkIfSipOnline() {
		new RestEndpoints().isSipOnline(308)
			.then(isOnline => {
				let serverEvent: WebsocketServerEventInterface = isOnline ? {
					type: 'READY',
				} : {
					type: 'ERROR',
					error: 'CLIENT_SIP_UNAVAILABLE'
				};

				this.sendEvent(serverEvent);
			}).catch(err => {
			this.sendEvent({
				type: 'ERROR',
				error: err.message
			});
		});
	}

}