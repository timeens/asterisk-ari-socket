import { HttpRequest } from './http-request';
import { AppLogger } from '../../logger/app-logger';

export class RestEndpointsSip extends HttpRequest {

	endpoint = 'endpoints/sip';

	public async isSipOnline(sip: number): Promise<boolean> {
		AppLogger.debug(`Checking if sip ${sip} is online`);
		let sipData: any = await this.getOne(sip);
		return sipData.state === 'online';
	}
}