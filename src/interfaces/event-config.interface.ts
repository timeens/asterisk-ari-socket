import { ParamInterface } from './param.interface';

export interface EventConfigInterface {
	name: 'HANDSHAKE' | 'OUTBOUND_CALL' | 'HANGUP';
	requiredParams?: Array<ParamInterface>;
}