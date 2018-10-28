import { AriChannelInterface } from '../interfaces/ari/ari-channel.interface';
import { WebsocketClient } from './websocket-client';
import { $log } from 'ts-log-debug';

export abstract class BaseCall {
	protected clientSocket: WebsocketClient;
	protected stasisAppSocket: WebSocket;
	protected stasisAppName: string;
	protected remoteEndpoint: string;
	protected bridge: string;
	protected clientChannel: AriChannelInterface;
	protected remoteChannel: AriChannelInterface;
	protected callConnected: boolean = false;

	constructor(clientSocket: WebsocketClient, remoteNb: string) {
		this.clientSocket = clientSocket;
		this.stasisAppName = `${clientSocket.clientSipId}_outbound`;
		this.stasisAppSocket = clientSocket.ariRest.restEvents.stasisAppWebsocket(this.stasisAppName);
		this.remoteEndpoint = remoteNb;
		this.debugMessage(`Initialize outbound call`);
	}


	public async setClientSipChannel() {
		this.clientChannel = await this.clientSocket.ariRest.restChannels.create(this.clientSocket.clientSipId, this.stasisAppName);
	}

	protected debugMessage(msg) {
		$log.debug(`Stasis App: ${this.stasisAppName} - ${msg}`);
	}


	public canHangUp() {
		return (this.clientChannel || this.callConnected);
	}
}