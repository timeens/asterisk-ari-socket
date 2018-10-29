import { WebsocketClient } from './websocket-client';
import { AriWeboscketEventModel } from '../models/ari/ari-weboscket-event.model';
import { BaseCall } from './base-call';


export class OutboundCall extends BaseCall {

	constructor(clientSocket: WebsocketClient, remoteNb: string) {
		super(clientSocket, remoteNb);
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
			// todo modify this to remote endpoint and activate trunk
			let res: any = await this.clientSocket.ariRest.restChannels.create(3001, this.stasisAppName, false);
			if (res.error) {
				this.clientSocket.sendError([{code: 'ENDPOINT_ERROR', data: res.error}]);
				return this.hangUp();
			}
			this.remoteChannel = res;
			this.clientSocket.sendEvent({name: 'REMOTE_RINGING'});
			this.clientSocket.ariRest.restChannels.sendRing(this.clientChannel.id);
		}
	}

	protected async remoteChannelEventHandler(event: AriWeboscketEventModel) {
		console.log(event.type);
		if (event.type === 'StasisStart') {
			await this.createBridgeAndAddChannels();
			this.clientSocket.sendEvent({name: 'CALL_CONNECTED'});
		}
	}

	public async hangUp(hangupCause: string = null) {
		let sendHangUpEvent = false;
		let who = 'client';
		if (this.clientChannel) {
			await this.clientSocket.ariRest.restChannels.hangup(this.clientChannel.id);
			this.clientChannel = null;
			sendHangUpEvent = true;
		}
		if (this.remoteChannel) {
			who = 'remote';
			await this.clientSocket.ariRest.restChannels.hangup(this.remoteChannel.id);
			this.remoteChannel = null;
			sendHangUpEvent = true;
		}
		// todo destroy bridge
		this.callConnected = false;
		if (this.stasisAppSocket.OPEN) this.stasisAppSocket.close();
		if (sendHangUpEvent) this.clientSocket.sendEvent({name: 'HANGUP', params: [{key: 'hangupCause', value: hangupCause}, {key: 'who', value: who}]});
	}
}