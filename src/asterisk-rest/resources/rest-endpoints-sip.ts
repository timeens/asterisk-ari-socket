import { HttpRequest } from './http-request';

export class RestEndpointsSip extends HttpRequest {

	endpoint = 'endpoints/sip';

	public isSipOnline(sip: number): Promise<boolean> {
		return new Promise((res, rej) => {
			this.getOne(sip).then((r: any) => {
				return res(r.state === 'online');
			}).catch(err => {
				return rej(err);
			})
		});
	}
}