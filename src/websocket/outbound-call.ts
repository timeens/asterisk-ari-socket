import { WebsocketClient } from './websocket-client';
import { $log } from 'ts-log-debug';
import { AriChannelInterface } from '../interfaces/ari/ari-channel.interface';
import { AriWeboscketEventModel } from '../models/ari/ari-weboscket-event.model';

export class OutboundCall {

	protected clientSocket: WebsocketClient;
	protected stasisAppSocket: WebSocket;
	protected stasisAppName: string;
	protected remote: string;
	protected bridge: string;
	protected channelToClient: AriChannelInterface;
	protected channelToRemote: AriChannelInterface;

	constructor(clientSocket: WebsocketClient, remoteNb: string) {
		this.clientSocket = clientSocket;
		this.stasisAppName = `${clientSocket.clientSipId}_outbound`;
		this.stasisAppSocket = clientSocket.ariRest.restEvents.stasisAppWebsocket(this.stasisAppName);
		this.remote = remoteNb;
		this.debugMessage(`Initialize outbound call`);
		this.listenOnStasis();
	}

	listenOnStasis() {
		this.stasisAppSocket.onopen = () => {
			this.debugMessage(`Ws Connection to Stasis open`);
			this.setClientSipChannel();
		};
		this.stasisAppSocket.onmessage = (msg) => {
			this.reactToAsteriskEvent(new AriWeboscketEventModel(msg.data));
		};
		this.stasisAppSocket.onerror = (err) => {
			// console.log(err);
		};
		this.stasisAppSocket.onclose = () => {
			this.debugMessage('Ws connection closed');
		}
	}

	protected async reactToAsteriskEvent(event: AriWeboscketEventModel) {
		console.log(event.data);
	}


	async setClientSipChannel() {
		this.channelToClient = await this.clientSocket.ariRest.restChannels.create(this.clientSocket.clientSipId, this.stasisAppName);
	}

	private debugMessage(msg) {
		$log.debug(`Stasis App: ${this.stasisAppName} - ${msg}`);
	}

}