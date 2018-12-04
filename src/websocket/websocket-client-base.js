import { AriRest } from '../asterisk-rest/ari-rest';
export class WebsocketClientBase {
    constructor(socket) {
        this.serverToClientSocket = socket;
        this.clientIp = socket._socket.remoteAddress;
        this.ariRest = new AriRest();
    }
    sendError(errors) {
        let res = { name: 'ERROR', errors: errors };
        this.serverToClientSocket.send(JSON.stringify(res));
    }
    sendEvent(event) {
        this.serverToClientSocket.send(JSON.stringify(event));
    }
}
