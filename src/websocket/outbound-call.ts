import { WebsocketClient } from './websocket-client';
import { $log } from 'ts-log-debug';
import { AriChannelInterface } from '../interfaces/ari/ari-channel.interface';
import { AriWeboscketEventModel } from '../models/ari/ari-weboscket-event.model';

export class OutboundCall {

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
		this.listenOnStasis();
	}

	listenOnStasis() {
		this.stasisAppSocket.onopen = () => {
			this.debugMessage(`Ws Connection to Stasis open`);
			this.setClientSipChannel();
		};
		this.stasisAppSocket.onmessage = (msg) => {
			let event = new AriWeboscketEventModel(msg.data);
			if (event.isRelevant()) this.eventHandler(event);

		};
		this.stasisAppSocket.onerror = (err) => {
			// console.log(err);
		};
		this.stasisAppSocket.onclose = () => {
			this.debugMessage('Ws connection closed');
		}
	}

	protected eventHandler(event: AriWeboscketEventModel) {
		if (event.type === 'ChannelDestroyed') return this.destroyCall();
		switch (event.channel.id) {
			case this.clientChannel.id:
				this.clientChannelEventHandler(event);
				break;
			case this.remoteChannel.id:
				this.remoteChannelEventHandler(event);
				break;
		}
	}

	protected async clientChannelEventHandler(event: AriWeboscketEventModel) {

	}

	protected async remoteChannelEventHandler(event: AriWeboscketEventModel) {

	}

	protected async destroyCall(hangupCause: string = null) {
		let who = 'client';
		if (this.clientChannel) {
			await this.clientSocket.ariRest.restChannels.hangup(this.clientChannel.id);
			this.clientChannel = null;
		}
		if (this.remoteChannel) {
			who = 'remote';
			await this.clientSocket.ariRest.restChannels.hangup(this.clientChannel.id);
			this.remoteChannel = null;
		}
		// todo destroy bridge
		this.clientSocket.sendEvent({name: 'HANGUP', params: [{key: 'hangupCause', value: hangupCause}, {key: 'who', value: who}]});
	}

	async setClientSipChannel() {
		this.clientChannel = await this.clientSocket.ariRest.restChannels.create(this.clientSocket.clientSipId, this.stasisAppName);
	}

	private debugMessage(msg) {
		$log.debug(`Stasis App: ${this.stasisAppName} - ${msg}`);
	}

}