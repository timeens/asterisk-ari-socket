import { CallInterface } from './call.interface';

export interface WebsocketClientEventInterface {
	type: 'HANDSHAKE' | 'OUTBOUND_CALL' | 'ANSWER_INBOUND_CALL'
	isBroadcast?: boolean;
	error?: 'CLIENT_SIP_UNAVAILABLE' | '';
	call?: CallInterface
}