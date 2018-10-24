import * as request from 'request';
import { $log } from "ts-log-debug";


export abstract class HttpRequest {

	public abstract endpoint: string;

	getAll(): Promise<any> {
		return this.get();
	}

	getOne(uid): Promise<any> {
		return this.get(uid);
	}

	private get(uid?) {
		return new Promise((res, rej) => {
			let uri = this.generateUri(uid);
			$log.debug(`HTTP GET request to ${uri}`);
			request.get(uri, (err, data) => {
				if (err) return rej(err);
				res(this.parse(data.body));
			})
		});
	}

	post() {

	}

	delete() {

	}


	private parse(body) {
		return JSON.parse(body);
	}


	private generateUri(uid?): string {
		let uri = `${process.env.ARI_REST_URI}:${process.env.ARI_REST_PORT}/ari/${this.endpoint}`;
		let authPart = `api_key=${process.env.ARI_REST_USERNAME}:${process.env.ARI_REST_PASSWORD}`;

		if (uid) uri = `${uri}/${uid}`;

		return `${uri}?${authPart}`;
	}
}