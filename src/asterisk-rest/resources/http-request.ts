import * as request from 'request';
import { $log } from "ts-log-debug";


export abstract class HttpRequest {

	protected abstract endpoint: string;

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

	post(body, uri = null): Promise<any> {
		return new Promise((res, rej) => {
			let requestUri = this.generateUri(uri);
			$log.debug(`HTTP POST request to ${requestUri} - Request Body: ${JSON.stringify(body)}`);
			request.post(requestUri, {form: body}, (err, data) => {
				if (err) return rej(err);
				res(this.parse(data.body));
			})
		});
	}

	delete(uid): Promise<any> {
		return new Promise((res, rej) => {
			let uri = this.generateUri(uid);
			$log.debug(`HTTP DELETE request to ${uri}`);
			request.delete(uri, (err, data) => {
				if (err) return rej(err);
				res(this.parse(data.body));
			})
		});
	}


	private parse(body) {
		try {
			return JSON.parse(body)
		} catch (err) {
			return null;
		}
	}


	protected generateUri(between?): string {
		let uri = this.baseUri;
		if (between) uri = `${uri}/${between}`;

		return `${uri}?${this.authUrlPart}`;
	}

	protected get eventsWebsocketUri(): string {
		let protokoll = 'ws://';
		let uri = `${protokoll}${process.env.ARI_REST_IP}:${process.env.ARI_REST_PORT}/ari/${this.endpoint}`;

		return `${uri}?${this.authUrlPart}`;
	}

	protected get authUrlPart() {
		return `api_key=${process.env.ARI_REST_USERNAME}:${process.env.ARI_REST_PASSWORD}`;
	}

	protected get protocol() {
		return process.env.HTTPS ? 'https://' : 'http://';
	}

	protected get baseUri() {
		return `${this.protocol}${process.env.ARI_REST_IP}:${process.env.ARI_REST_PORT}/ari/${this.endpoint}`;
	}
}