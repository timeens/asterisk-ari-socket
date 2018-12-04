import { HttpRequest } from './http-request';
export class RestApplications extends HttpRequest {
    constructor() {
        super(...arguments);
        this.endpoint = 'applications';
    }
}
