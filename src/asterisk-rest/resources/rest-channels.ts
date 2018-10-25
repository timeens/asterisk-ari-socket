import { HttpRequest } from './http-request';

export class RestChannels extends HttpRequest {

	endpoint = 'channels';


	async create(endpoint: string | number, stasisAppName: string) {
		let data = {
			endpoint: `SIP/${endpoint}`,
			callerId: process.env.SERVER_DISPLAY_NAME || 'unknown',
			app: stasisAppName
		};
		return this.post(data);
	}

}