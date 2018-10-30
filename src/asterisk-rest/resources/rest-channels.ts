import { HttpRequest } from './http-request';
import { AriChannelInterface } from '../../interfaces/ari/ari-channel.interface';
import { AppLogger } from '../../logger/app-logger';

export class RestChannels extends HttpRequest {

	protected endpoint = 'channels';


	async create(endpoint: string | number, stasisAppName: string, useTrunk?: boolean): Promise<AriChannelInterface> {
		let data = {
			endpoint: useTrunk ? `SIP/${endpoint}@${process.env.TRUNK_NAME}` : `SIP/${endpoint}`,
			callerId: process.env.SERVER_DISPLAY_NAME || 'unknown',
			app: stasisAppName,
			timeout: process.env.CHANNEL_TIMEOUT || 25
		};
		AppLogger.debug(`Create Channel`);

		return this.post(data);
	}


	async hangup(channelId: string) {
		AppLogger.debug(`Hangup Channel ${channelId}`);
		return this.delete(channelId);
	}

	async answer(channelId) {
		AppLogger.debug(`Answer Channel ${channelId}`);
		return this.post(null, `${channelId}/answer`);
	}

	async sendRing(channelId: string) {
		AppLogger.debug(`Indicate ringing to channel ${channelId}`);
		let uri = `${channelId}/ring`;
		return this.post(null, uri);
	}

}