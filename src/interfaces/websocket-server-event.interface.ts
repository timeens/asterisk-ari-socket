export interface WebsocketServerEventInterface {
	type: 'READY' | 'ERROR' | 'INBOUND_CALL_QUEUE_CHANGE';
	isBroadcast?: boolean;
	error?: 'CLIENT_SIP_UNAVAILABLE' | '';
}