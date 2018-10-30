import { AriChannelInterface } from '../interfaces/ari/ari-channel.interface';
import { WebsocketClient } from './websocket-client';
import { AppLogger } from '../logger/app-logger';

export abstract class BaseCall {
	protected clientSocket: WebsocketClient;
	protected stasisAppSocket: WebSocket;
	protected stasisAppName: string;
	protected remoteEndpoint: string;
	protected bridge: string;
	protected clientChannel: AriChannelInterface = null;
	protected remoteChannel: AriChannelInterface = null;
	protected callConnected: boolean = false;

	private _callState: 'NEUTRAL' | 'CLIENT_RINGING' | 'REMOTE_RINGING' | 'DESTROYING' | 'CONNECTED' = 'NEUTRAL';

	get callState() {
		return this._callState;
	}

	set callState(state: 'NEUTRAL' | 'CLIENT_RINGING' | 'REMOTE_RINGING' | 'DESTROYING' | 'CONNECTED') {
		this.debugMessage(`State Change: ${state}`);
		this._callState = state;
	}

	constructor(clientSocket: WebsocketClient, remoteNb: string) {
		this.clientSocket = clientSocket;
		this.stasisAppName = `${clientSocket.clientSipId}_outbound`;
		this.stasisAppSocket = clientSocket.ariRest.restEvents.stasisAppWebsocket(this.stasisAppName);
		this.remoteEndpoint = remoteNb;
		this.debugMessage(`Call Init - WS open`);
	}

	public async setClientSipChannel() {
		this.clientChannel = await this.clientSocket.ariRest.restChannels.create(this.clientSocket.clientSipId, this.stasisAppName);
		this.clientSocket.sendEvent({name: 'CLIENT_SIP_RINGING'});
		this.callState = 'CLIENT_RINGING';
	}

	protected debugMessage(msg) {
		AppLogger.info(`Stasis App: ${this.stasisAppName} - ${msg}`);
	}

	protected async createBridge(channelIds: Array<string> = []) {
		if (channelIds.length > 0) {
			this.bridge = await this.clientSocket.ariRest.restBridges.create();
			return this.clientSocket.ariRest.restBridges.addChannel(this.bridge, channelIds);
		}
		return this.clientSocket.ariRest.restBridges.create();
	}

	protected async addChannelToExistingBridge(channelIds: Array<string>) {
		if (this.bridge) return this.clientSocket.ariRest.restBridges.addChannel(this.bridge, channelIds);
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

	protected async destroy() {
		if (this.callState === 'DESTROYING') return;
		this.callState = 'DESTROYING';

		if (this.clientChannel) await this.hangUpClient();
		if (this.remoteChannel) await this.hangUpRemote();
		if (this.bridge) await this.destroyBridge();
		if (this.stasisAppSocket.OPEN) this.stasisAppSocket.close();
		this.clientSocket.sendEvent({name: 'HANGUP'});
		this.callState = 'NEUTRAL';
	}


	public get inProgress(): boolean {
		return (this.callState !== 'NEUTRAL');
	}
}