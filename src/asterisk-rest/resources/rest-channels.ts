import { HttpRequest } from './http-request';
import { AriChannelInterface } from '../../interfaces/ari/ari-channel.interface';

export class RestChannels extends HttpRequest {

	protected endpoint = 'channels';


	async create(endpoint: string | number, stasisAppName: string, useTrunk?: boolean): Promise<AriChannelInterface> {
		let data = {
			endpoint: useTrunk ? `SIP/${endpoint}@${process.env.TRUNK_NAME}` : `SIP/${endpoint}`,
			callerId: process.env.SERVER_DISPLAY_NAME || 'unknown',
			app: stasisAppName,
			timeout: process.env.CHANNEL_TIMEOUT || 25
		};

		return this.post(data);
	}


	async hangup(channelId: string) {
		return this.delete(channelId);
	}

	async answer(channelId) {
		return this.post(null, `${channelId}/answer`);
	}

	async sendRing(channelId: string) {
		let uri = `${channelId}/ring`;
		return this.post(null, uri);
	}

}