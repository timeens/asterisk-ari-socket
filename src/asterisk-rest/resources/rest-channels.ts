import { HttpRequest } from './http-request';
import { AriChannelInterface } from '../../interfaces/ari/ari-channel.interface';

export class RestChannels extends HttpRequest {

	endpoint = 'channels';


	async create(endpoint: string | number, stasisAppName: string): Promise<AriChannelInterface> {
		let data = {
			endpoint: `SIP/${endpoint}`,
			callerId: process.env.SERVER_DISPLAY_NAME || 'unknown',
			app: stasisAppName
		};

		return await this.post(data);
	}


	async hangup(channelId: string) {
		return this.delete(channelId);
	}

}