export interface AriWebsocketEventInterface {
	forward: string,
	type: "Dial",
	asterisk_id: string,
	timestamp: string,
	peer: {
		id: string,
		language: string
		connected: {
			name: string,
			number: string
		},
		name: string,
		state: "Down",
		caller: {
			name: string,
			number: string
		},
		accountcode: string,
		dialplan: {
			context: string,
			priority: number,
			exten: string
		},
		creationtime: string
	},
	dialstatus: string,
	dialstring: string,
	application: string
}