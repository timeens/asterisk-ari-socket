import { WebsocketClient } from './websocket-client';
import { $log } from 'ts-log-debug';

export class OutboundCall {

	protected clientSocket: WebsocketClient;
	protected stasisAppSocket: WebSocket;
	protected stasisAppName: string;
	protected remote: string;
	protected bridge: string;
	protected channelToClient: string;
	protected channelToRemote: string;

	constructor(clientSocket: WebsocketClient, remoteNb: string) {
		$log.debug(`New outbound call client = ${clientSocket.clientIp}`);
		this.clientSocket = clientSocket;
		this.stasisAppName = `${clientSocket.clientSipId}:outbound`;
		this.stasisAppSocket = clientSocket.ariRest.restEvents.stasisAppWebsocket(this.stasisAppName);
		this.remote = remoteNb;
		this.listenOnStasis();
	}

	listenOnStasis() {
		this.stasisAppSocket.onopen = () => {
			this.debugMessage(`Ws Connection to Stasis open`);
			this.debugMessage(`call to ${this.remote}`);
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