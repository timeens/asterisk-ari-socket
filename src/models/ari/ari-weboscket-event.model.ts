import { AriWebsocketEventInterface } from '../../interfaces/ari/ari-websocket-event.interface';

export class AriWeboscketEventModel {

	data: AriWebsocketEventInterface;

	constructor(eventString: string) {
		this.data = JSON.parse(eventString);
	}
}