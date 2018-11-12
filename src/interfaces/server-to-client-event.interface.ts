export interface ServerToClientEventInterface {
	name: 'READY' | 'HANGUP' | 'CLIENT_SIP_RINGING' | 'REMOTE_RINGING' | 'CALL_CONNECTED' | 'ERROR' | 'INBOUND_CALL' | 'INBOUND_CALL_HUNGUP';
	params?: Array<{
		key: string,
		value: string
	}>
}