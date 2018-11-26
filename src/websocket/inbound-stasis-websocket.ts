import { AriRest } from '../asterisk-rest/ari-rest';
import events = require('events');
import { ServerToClientEventInterface } from '../interfaces/server-to-client-event.interface';
import { AriWeboscketEventModel } from '../models/ari/ari-weboscket-event.model';
import { AppLogger } from '../logger/app-logger';

export class InboundStasisWebsocket extends events.EventEmitter {

	private wsToStasisInbound: WebSocket;
	private stasisInboundAppName: string;
	events = new events.EventEmitter();

	constructor() {
		super();
		this.stasisInboundAppName = process.env['INBOUND_STASIS_APP_NAME'];
		if (!this.stasisInboundAppName) throw new Error('Stasis inbound app name missing');
		this.listen();
	}

	listen() {
		this.wsToStasisInbound = new AriRest().restEvents.stasisAppWebsocket(this.stasisInboundAppName);
		this.wsToStasisInbound.onmessage = (event: any) => {
			let ariEvent = new AriWeboscketEventModel(event.data);
			if (ariEvent.isRelevant()) {
				let params = [
					{key: 'NB', value: ariEvent.callingNumber},
					{key: 'CHANNEL_ID', value: ariEvent.channel.id},
				];
				switch (ariEvent.type) {
					case 'StasisStart':
						this.emitEvent({
							name: 'INBOUND_CALL',
							params: params
						});
						break;
					case 'StasisEnd':
						this.emitEvent({
							name: 'INBOUND_CALL_HUNGUP',
							params: params
						});
						break;
				}
			}
		}
	}

	emitEvent(event: ServerToClientEventInterface) {
		this.events.emit('event', JSON.stringify(event));
	}
}