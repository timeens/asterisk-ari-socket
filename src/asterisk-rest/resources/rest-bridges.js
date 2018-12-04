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
export class RestBridges extends HttpRequest {
    constructor() {
        super(...arguments);
        this.endpoint = 'bridges';
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            let bridge = yield this.post(null);
            AppLogger.debug(`Bridge created: ${bridge.id}`);
            return bridge.id;
        });
    }
    shutDown(bridgeId) {
        return __awaiter(this, void 0, void 0, function* () {
            AppLogger.debug(`Shutdown bridge: ${bridgeId}`);
            return this.delete(bridgeId);
        });
    }
    addChannel(bridgeId, channelIds) {
        return __awaiter(this, void 0, void 0, function* () {
            AppLogger.debug(`Add Channels:${channelIds.join(',')} to bridge: ${bridgeId}`);
            let uri = `${bridgeId}/addChannel`;
            let body = {
                channel: channelIds.join(',')
            };
            return this.post(body, uri);
        });
    }
}
