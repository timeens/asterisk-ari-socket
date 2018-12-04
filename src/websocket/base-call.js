var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AppLogger } from '../logger/app-logger';
export class BaseCall {
    constructor(clientSocket, remoteNb) {
        this.clientChannel = null;
        this.remoteChannel = null;
        this.callConnected = false;
        this._callState = 'NEUTRAL';
        this.clientSocket = clientSocket;
        this.stasisAppName = `${clientSocket.clientSipId}_outbound`;
        this.stasisAppSocket = clientSocket.ariRest.restEvents.stasisAppWebsocket(this.stasisAppName);
        this.remoteEndpoint = remoteNb;
        this.debugMessage(`Call Init - WS open`);
    }
    get callState() {
        return this._callState;
    }
    set callState(state) {
        this.debugMessage(`State Change: ${state}`);
        this._callState = state;
    }
    setClientSipChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            this.clientChannel = yield this.clientSocket.ariRest.restChannels.create(this.clientSocket.clientSipId, this.stasisAppName);
            this.clientSocket.sendEvent({ name: 'CLIENT_SIP_RINGING' });
            this.callState = 'CLIENT_RINGING';
        });
    }
    debugMessage(msg) {
        AppLogger.info(`Stasis App: ${this.stasisAppName} - ${msg}`);
    }
    createBridge(channelIds = []) {
        return __awaiter(this, void 0, void 0, function* () {
            if (channelIds.length > 0) {
                this.bridge = yield this.clientSocket.ariRest.restBridges.create();
                return this.clientSocket.ariRest.restBridges.addChannel(this.bridge, channelIds);
            }
            return this.clientSocket.ariRest.restBridges.create();
        });
    }
    addChannelToExistingBridge(channelIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.bridge)
                return this.clientSocket.ariRest.restBridges.addChannel(this.bridge, channelIds);
        });
    }
    hangUpClient() {
        if (this.clientChannel)
            return this.clientSocket.ariRest.restChannels.hangup(this.clientChannel.id);
    }
    hangUpRemote() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.remoteChannel)
                return this.clientSocket.ariRest.restChannels.hangup(this.remoteChannel.id);
        });
    }
    destroyBridge() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.bridge)
                return this.clientSocket.ariRest.restBridges.shutDown(this.bridge);
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.callState === 'DESTROYING')
                return;
            this.callState = 'DESTROYING';
            if (this.clientChannel)
                yield this.hangUpClient();
            if (this.remoteChannel)
                yield this.hangUpRemote();
            if (this.bridge)
                yield this.destroyBridge();
            if (this.stasisAppSocket.OPEN)
                this.stasisAppSocket.close();
            this.clientSocket.sendEvent({ name: 'HANGUP' });
            this.callState = 'NEUTRAL';
        });
    }
    get inProgress() {
        return (this.callState !== 'NEUTRAL');
    }
}
