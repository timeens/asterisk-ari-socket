var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AriWeboscketEventModel } from '../models/ari/ari-weboscket-event.model';
import { BaseCall } from './base-call';
export class OutboundCall extends BaseCall {
    constructor(clientSocket, remoteNb, displayName) {
        super(clientSocket, remoteNb);
        this.displayName = null;
        this.displayName = displayName;
        this.debugMessage(`Remote Nb${remoteNb.isInternal ? '(internal)' : '(external)'}: ${remoteNb.number}`);
        this.listenOnStasis();
    }
    listenOnStasis() {
        this.stasisAppSocket.onopen = () => {
            this.setClientSipChannel();
        };
        this.stasisAppSocket.onmessage = (msg) => {
            let event = new AriWeboscketEventModel(msg.data);
            if (event.isRelevant())
                this.eventHandler(event);
        };
        this.stasisAppSocket.onerror = (err) => {
            // console.log(err);
        };
        this.stasisAppSocket.onclose = () => {
            this.debugMessage(`Call ended - WS closed`);
        };
    }
    eventHandler(event) {
        if (event.type === 'ChannelDestroyed' || event.type === 'StasisEnd')
            return this.destroy();
        if (this.clientChannel && event.channel.id === this.clientChannel.id)
            return this.clientChannelEventHandler(event);
        if (this.remoteChannel && event.channel.id === this.remoteChannel.id)
            return this.remoteChannelEventHandler(event);
    }
    clientChannelEventHandler(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.type === 'StasisStart') {
                let res = yield this.clientSocket.ariRest.restChannels.create(this.remoteEndpoint.number, this.stasisAppName, this.displayName, !this.remoteEndpoint.isInternal);
                if (res.error) {
                    yield this.destroy();
                    return this.clientSocket.sendError([{ code: 'ENDPOINT_ERROR', data: res.error }]);
                }
                this.callState = 'REMOTE_RINGING';
                this.remoteChannel = res;
                this.clientSocket.sendEvent({ name: 'REMOTE_RINGING' });
                this.createBridge([this.clientChannel.id]);
                this.clientSocket.ariRest.restChannels.sendRing(this.clientChannel.id);
            }
        });
    }
    remoteChannelEventHandler(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.type === 'StasisStart') {
                this.clientSocket.ariRest.restChannels.removeRing(this.clientChannel.id);
                yield this.addChannelToExistingBridge([this.remoteChannel.id]);
                this.callState = 'CONNECTED';
                this.clientSocket.sendEvent({ name: 'CALL_CONNECTED' });
            }
        });
    }
}
