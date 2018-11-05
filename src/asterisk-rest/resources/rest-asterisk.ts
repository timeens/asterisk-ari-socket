import { HttpRequest } from './http-request';

export class RestAsterisk extends HttpRequest {

	endpoint = 'asterisk';

	public async isAvailable(): Promise<string> {
		let url = 'info';
		let res = await this.getOne(url);
		return res.system.version;
	}

}