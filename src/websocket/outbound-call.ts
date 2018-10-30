import { WebsocketClient } from './websocket-client';
import { AriWeboscketEventModel } from '../models/ari/ari-weboscket-event.model';
import { BaseCall } from './base-call';


export class OutboundCall extends BaseCall {

	constructor(clientSocket: WebsocketClient, remoteNb: string) {
		super(clientSocket, remoteNb);
		this.debugMessage(`Remote Nb: ${remoteNb}`);
		this.listenOnStasis();
	}

	listenOnStasis() {
		this.stasisAppSocket.onopen = () => {
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
			this.debugMessage(`Call ended - WS closed`);
		}
	}

	protected eventHandler(event: AriWeboscketEventModel) {
		if (event.type === 'ChannelDestroyed' || event.type === 'StasisEnd') return this.destroy();
		if (this.clientChannel && event.channel.id === this.clientChannel.id) return this.clientChannelEventHandler(event);
		if (this.remoteChannel && event.channel.id === this.remoteChannel.id) return this.remoteChannelEventHandler(event);
	}

	protected async clientChannelEventHandler(event: AriWeboscketEventModel) {
		if (event.type === 'StasisStart') {
			let res: any = await this.clientSocket.ariRest.restChannels.create(this.remoteEndpoint, this.stasisAppName, true);
			if (res.error) {
				await this.destroy();
				return this.clientSocket.sendError([{code: 'ENDPOINT_ERROR', data: res.error}]);
			}
			this.callState = 'REMOTE_RINGING';
			this.remoteChannel = res;
			this.clientSocket.sendEvent({name: 'REMOTE_RINGING'});
			this.createBridge([this.clientChannel.id]);
			this.clientSocket.ariRest.restChannels.sendRing(this.clientChannel.id);
		}
	}

	protected async remoteChannelEventHandler(event: AriWeboscketEventModel) {
		if (event.type === 'StasisStart') {
			this.clientSocket.ariRest.restChannels.removeRing(this.clientChannel.id);
			await this.addChannelToExistingBridge([this.remoteChannel.id]);
			this.callState = 'CONNECTED';
			this.clientSocket.sendEvent({name: 'CALL_CONNECTED'});
		}
	}
}