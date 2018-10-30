import { AriChannelInterface } from '../interfaces/ari/ari-channel.interface';
import { WebsocketClient } from './websocket-client';
import { $log } from 'ts-log-debug';

export abstract class BaseCall {
	protected clientSocket: WebsocketClient;
	protected stasisAppSocket: WebSocket;
	protected stasisAppName: string;
	protected remoteEndpoint: string;
	protected bridge: string;
	protected clientChannel: AriChannelInterface = null;
	protected remoteChannel: AriChannelInterface = null;
	protected callConnected: boolean = false;
	protected isDestroying = false;

	constructor(clientSocket: WebsocketClient, remoteNb: string) {
		this.clientSocket = clientSocket;
		this.stasisAppName = `${clientSocket.clientSipId}_outbound`;
		this.stasisAppSocket = clientSocket.ariRest.restEvents.stasisAppWebsocket(this.stasisAppName);
		this.remoteEndpoint = remoteNb;
		this.debugMessage(`Initialize outbound call`);
	}


	public async setClientSipChannel() {
		this.clientChannel = await this.clientSocket.ariRest.restChannels.create(this.clientSocket.clientSipId, this.stasisAppName);
		this.clientSocket.sendEvent({name: 'CLIENT_SIP_RINGING'});
	}

	protected debugMessage(msg) {
		$log.debug(`Stasis App: ${this.stasisAppName} - ${msg}`);
	}

	protected async createBridgeAndAddChannels() {
		this.bridge = await this.clientSocket.ariRest.restBridges.create();
		return this.clientSocket.ariRest.restBridges.addChannel(this.bridge, [this.clientChannel.id, this.remoteChannel.id]);
	}

	public hangUpClient() {
		if (this.clientChannel) return this.clientSocket.ariRest.restChannels.hangup(this.clientChannel.id);
	}

	protected async hangUpRemote() {
		if (this.remoteChannel) return this.clientSocket.ariRest.restChannels.hangup(this.remoteChannel.id);
	}

	protected async destroyBridge() {
		if (this.bridge) return this.clientSocket.ariRest.restBridges.shutDown(this.bridge);
	}

	public canHangUp() {
		return (this.clientChannel || this.callConnected);
	}

	protected async destroy() {
		if (this.isDestroying) return;
		this.isDestroying = true;

		if (this.clientChannel) await this.hangUpClient();
		if (this.remoteChannel) await this.hangUpRemote();
		if (this.bridge) await this.destroyBridge();
		this.stasisAppSocket.close();
		this.clientSocket.sendEvent({name: 'HANGUP'});
		this.callConnected = false;
		this.isDestroying = false;
	}
}