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
		if(event.type === 'ChannelDestroyed') return this.destroy();
		if (this.clientChannel && event.channel.id === this.clientChannel.id) this.clientChannelEventHandler(event);
		if (this.remoteChannel && event.channel.id === this.remoteChannel.id) this.remoteChannelEventHandler(event);
	}

	protected async clientChannelEventHandler(event: AriWeboscketEventModel) {
		if (event.type === 'StasisStart') {
			// todo modify this to remote endpoint and activate trunk
			let res: any = await this.clientSocket.ariRest.restChannels.create(3001, this.stasisAppName, false);
			if (res.error) return this.clientSocket.sendError([{code: 'ENDPOINT_ERROR', data: res.error}]);
			this.remoteChannel = res;
			this.clientSocket.sendEvent({name: 'REMOTE_RINGING'});
			this.clientSocket.ariRest.restChannels.sendRing(this.clientChannel.id);
		}
	}

	protected async remoteChannelEventHandler(event: AriWeboscketEventModel) {
		if (event.type === 'StasisStart') {
			this.createBridgeAndAddChannels();
			this.clientSocket.sendEvent({name: 'CALL_CONNECTED'});
		}
	}
}