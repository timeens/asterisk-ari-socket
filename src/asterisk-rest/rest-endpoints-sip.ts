import { HttpRequest } from './http-request';

export class RestEndpointsSip extends HttpRequest {

	endpoint = 'endpoints/sip';


	isSipOnline(sip: number): Promise<boolean> {
		return new Promise((res, rej) => {
			this.get(sip).then((r: any) => {
				return res(r.state === 'online');
			}).catch(err => {
				return rej(err);
			})
		});
	}
}