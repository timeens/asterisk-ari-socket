var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WebsocketClientBase } from './websocket-client-base';
import { EventModel } from '../models/event.model';
import { OutboundCall } from './outbound-call';
import { AppLogger } from '../logger/app-logger';
import { PhoneNumber } from '../models/PhoneNumber';
export class WebsocketClient extends WebsocketClientBase {
    constructor(socket) {
        super(socket);
        this.outboundCall = null;
        this.listenToClient();
    }
    listenToClient() {
        this.serverToClientSocket.on('message', (msg) => {
            let event = new EventModel(msg);
            if (event.isValid) {
                this.reactToClientEvent(event);
            }
            else {
                this.sendError(event.errors);
            }
        });
        this.serverToClientSocket.on('close', () => {
            if (this.outboundCall)
                this.outboundCall.hangUpClient();
            AppLogger.info("Client disconnected");
        });
        // todo client close socket event
    }
    reactToClientEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (event.name) {
                case 'HANDSHAKE': {
                    this.clientSipId = event.getParam('sipNr');
                    (yield this.ariRest.restEndpointSip.isSipOnline(this.clientSipId)) ? this.sendEvent({ name: 'READY' }) : this.sendError([{ code: 'SIP_UNAVAILABLE' }]);
                    break;
                }
                case 'OUTBOUND_CALL': {
                    if (this.callInProgress)
                        return this.sendError([{ code: 'CALL_IN_PROGRESS' }]);
                    if (!this.clientSipId)
                        return this.sendError([{ code: 'SIP_UNAVAILABLE' }]);
                    let remoteEndpoint = event.getParam('remoteEndpoint');
                    let displayName = event.getParam('displayName');
                    this.outboundCall = new OutboundCall(this, new PhoneNumber(remoteEndpoint), displayName);
                    break;
                }
                case 'HANGUP': {
                    if (!this.callInProgress)
                        return this.sendError([{ code: 'HANG_UP_NO_ACTIVE_CALL' }]);
                    yield this.outboundCall.hangUpClient();
                    this.outboundCall = null;
                }
            }
        });
    }
    get callInProgress() {
        return this.outboundCall && this.outboundCall.inProgress;
    }
}
