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
export class RestEndpointsSip extends HttpRequest {
    constructor() {
        super(...arguments);
        this.endpoint = 'endpoints/sip';
    }
    isSipOnline(sip) {
        return __awaiter(this, void 0, void 0, function* () {
            AppLogger.debug(`Checking if sip ${sip} is online`);
            let sipData = yield this.getOne(sip);
            return sipData.state === 'online';
        });
    }
}
