var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpRequest } from './http-request';
import { AppLogger } from '../../logger/app-logger';
export class RestChannels extends HttpRequest {
    constructor() {
        super(...arguments);
        this.endpoint = 'channels';
    }
    create(endpoint, stasisAppName, displayName, useTrunk) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                endpoint: useTrunk ? `SIP/${endpoint}@${process.env['TRUNK_NAME']}` : `SIP/${endpoint}`,
                callerId: displayName || process.env['SERVER_DISPLAY_NAME'] || 'unknown',
                app: stasisAppName,
                timeout: process.env['CHANNEL_TIMEOUT'] || 25
            };
            AppLogger.debug(`Create Channel`);
            return this.post(data);
        });
    }
    hangup(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            AppLogger.debug(`Hangup Channel ${channelId}`);
            return this.delete(channelId);
        });
    }
    answer(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            AppLogger.debug(`Answer Channel ${channelId}`);
            return this.post(null, `${channelId}/answer`);
        });
    }
    sendRing(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            AppLogger.debug(`Indicate ringing to channel ${channelId}`);
            let uri = `${channelId}/ring`;
            return this.post(null, uri);
        });
    }
    removeRing(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            AppLogger.debug(`Remove ring signal from channel ${channelId}`);
            let uri = `${channelId}/ring`;
            return this.delete(uri);
        });
    }
}
