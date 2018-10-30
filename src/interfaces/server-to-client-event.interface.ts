export interface ServerToClientEventInterface {
	name: 'READY' | 'HANGUP' | 'CLIENT_SIP_RINGING' | 'REMOTE_RINGING' | 'CALL_CONNECTED';
	params?: Array<{
		key: string,
		value: string
	}>
}