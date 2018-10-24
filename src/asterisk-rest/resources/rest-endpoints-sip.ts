import { HttpRequest } from './http-request';

export class RestEndpointsSip extends HttpRequest {

	endpoint = 'endpoints/sip';

	public async isSipOnline(sip: number): Promise<boolean> {
		let sipData: any = await this.getOne(sip);
		return sipData.state === 'online';
	}
}