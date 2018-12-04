import * as request from 'request';
import { AppLogger } from '../../logger/app-logger';
export class HttpRequest {
    getAll() {
        return this.get();
    }
    getOne(uid) {
        return this.get(uid);
    }
    get(uid) {
        return new Promise((res, rej) => {
            let uri = this.generateUri(uid);
            AppLogger.debug(`HTTP GET request to ${uri}`);
            request.get(uri, (err, data) => {
                if (err)
                    return rej(err);
                res(this.parse(data.body));
            });
        });
    }
    post(body, uri = null) {
        return new Promise((res, rej) => {
            let requestUri = this.generateUri(uri);
            AppLogger.debug(`HTTP POST request to ${requestUri} - Request Body: ${JSON.stringify(body)}`);
            request.post(requestUri, { form: body }, (err, data) => {
                if (err)
                    return rej(err);
                res(this.parse(data.body));
            });
        });
    }
    delete(uid) {
        return new Promise((res, rej) => {
            let uri = this.generateUri(uid);
            AppLogger.debug(`HTTP DELETE request to ${uri}`);
            request.delete(uri, (err, data) => {
                if (err)
                    return rej(err);
                res(this.parse(data.body));
            });
        });
    }
    parse(body) {
        try {
            return JSON.parse(body);
        }
        catch (err) {
            return null;
        }
    }
    generateUri(between) {
        let uri = this.baseUri;
        if (between)
            uri = `${uri}/${between}`;
        return `${uri}?${this.authUrlPart}`;
    }
    get eventsWebsocketUri() {
        let protokoll = 'ws://';
        let uri = `${protokoll}${process.env['ARI_REST_IP']}:${process.env['ARI_REST_PORT']}/ari/${this.endpoint}`;
        return `${uri}?${this.authUrlPart}`;
    }
    get authUrlPart() {
        return `api_key=${process.env['ARI_REST_USERNAME']}:${process.env['ARI_REST_PASSWORD']}`;
    }
    get protocol() {
        return process.env['HTTPS'] ? 'https://' : 'http://';
    }
    get baseUri() {
        return `${this.protocol}${process.env['ARI_REST_IP']}:${process.env['ARI_REST_PORT']}/ari/${this.endpoint}`;
    }
}
