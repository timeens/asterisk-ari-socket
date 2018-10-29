import { HttpRequest } from './http-request';

export class RestBridges extends HttpRequest {

	endpoint = 'bridges';


	public async create(): Promise<string> {
		let bridge = await this.post(null);

		return bridge.id;
	}

	public async shutDown(bridgeId: string): Promise<any> {
		return this.delete(bridgeId);
	}

	public async addChannel(bridgeId: string, channelIds: Array<string>): Promise<any> {
		let uri = `${bridgeId}/addChannel`;
		let body = {
			channel: channelIds.join(',')
		};
		return this.post(body, uri);
	}

}