import { WebsocketClient } from './websocket-client';
import { $log } from 'ts-log-debug';

export class OutboundCall {

	protected clientSocket: WebsocketClient;
	protected stasisAppSocket: WebSocket;
	protected stasisAppName: string;
	protected bridge: string;
	protected channelToClient: string;
	protected channelToRemote: string;

	constructor(clientSocket: WebsocketClient) {
		$log.debug(`New outbound call client = ${clientSocket.clientIp}`);
		this.clientSocket = clientSocket;
		this.stasisAppName = `${clientSocket.clientSipId}:outbound`;
		this.stasisAppSocket = clientSocket.ariRest.restEvents.stasisAppWebsocket(this.stasisAppName);
		this.listenOnStasis();
	}

	listenOnStasis() {
		this.stasisAppSocket.onopen = () => {
			this.debugMessage('Ws connection open');
		};
		this.stasisAppSocket.onmessage = (msg) => {
			console.log(msg);
		};
		this.stasisAppSocket.onerror = (err) => {
			console.log(err);
		};
		this.stasisAppSocket.onclose = () => {
			this.debugMessage('Ws connection closed');
		}
	}

	private debugMessage(msg) {
		$log.debug(`Stasis App: ${this.stasisAppName} - ${msg}`);
	}

}