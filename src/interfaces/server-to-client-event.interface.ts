export interface ServerToClientEventInterface {
	name: 'READY' | 'HANGUP' | 'CLIENT_SIP_CALL_REJECTED' | 'CLIENT_SIP_RINGING' | 'REMOTE_RINGING';
	params?: Array<{
		key: string,
		value: string
	}>
}