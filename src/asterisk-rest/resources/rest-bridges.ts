import { HttpRequest } from './http-request';
import { AppLogger } from '../../logger/app-logger';

export class RestBridges extends HttpRequest {

	endpoint = 'bridges';


	public async create(): Promise<string> {
		let bridge = await this.post(null);
		AppLogger.debug(`Bridge created: ${bridge.id}`);
		return bridge.id;
	}

	public async shutDown(bridgeId: string): Promise<any> {
		AppLogger.debug(`Shutdown bridge: ${bridgeId}`);
		return this.delete(bridgeId);
	}

	public async addChannel(bridgeId: string, channelIds: Array<string>): Promise<any> {
		AppLogger.debug(`Add Channels:${channelIds.join(',')} to bridge: ${bridgeId}`);
		let uri = `${bridgeId}/addChannel`;
		let body = {
			channel: channelIds.join(',')
		};

		let res = await this.post(body, uri);
		console.log(`response:`, res);
		return res;
	}

}