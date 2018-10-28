import { AriWebsocketEventInterface } from '../../interfaces/ari/ari-websocket-event.interface';

export class AriWeboscketEventModel {

	dataInterface: AriWebsocketEventInterface;
	private relevantEvents = ['StasisStart', 'StasisEnd', 'ChannelDestroyed', 'Dial'];

	constructor(eventString: string) {
		this.dataInterface = JSON.parse(eventString);
	}


	get channel() {
		return this.dataInterface.peer || this.dataInterface.channel || null;
	}

	get type() {
		return this.dataInterface.type;
	}

	isRelevant() {
		return this.relevantEvents.filter((str) => {
			return str === this.type;
		}).length === 1;
	}
}