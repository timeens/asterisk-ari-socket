export interface ServerToClientEventInterface {
	name: 'READY' | 'HANGUP' | 'CLIENT_SIP_CALL_REJECTED';
	params?: Array<{
		key: string,
		value: string
	}>
}