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
		if (event.type === 'ChannelDestroyed') return this.hangUp();
		if (!this.clientChannel) return;
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
		if (event.type === 'StasisStart') {
			// call remote endpoint
			// add remote channel to stasis
			// this.clientSocket.ariRest.restChannels.answer(this.clientChannel.id);
		}
	}

	protected async remoteChannelEventHandler(event: AriWeboscketEventModel) {
		if (event.type === 'StasisStart') {
			// create bridge
			// add channels to bridge
		}
	}

	public hangUp(hangupCause: string = null) {
		let sendHangUpEvent = false;
		let who = 'client';
		if (this.clientChannel) {
			this.clientSocket.ariRest.restChannels.hangup(this.clientChannel.id);
			this.clientChannel = null;
			sendHangUpEvent = true;
		}
		if (this.remoteChannel) {
			who = 'remote';
			this.clientSocket.ariRest.restChannels.hangup(this.clientChannel.id);
			this.remoteChannel = null;
			sendHangUpEvent = true;
		}
		// todo destroy bridge
		this.callConnected = false;
		if (sendHangUpEvent) this.clientSocket.sendEvent({name: 'HANGUP', params: [{key: 'hangupCause', value: hangupCause}, {key: 'who', value: who}]});
	}

	async setClientSipChannel() {
		this.clientChannel = await this.clientSocket.ariRest.restChannels.create(this.clientSocket.clientSipId, this.stasisAppName);
	}

	private debugMessage(msg) {
		$log.debug(`Stasis App: ${this.stasisAppName} - ${msg}`);
	}


	public canHangUp() {
		return (this.clientChannel || this.callConnected);
	}

}