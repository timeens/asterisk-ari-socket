export interface AriChannelInterface {
	id: string,
	language: string,
	connected: { name: string, number: string },
	name: string,
	state: string,
	caller: { name: string, number: string },
	accountcode: string,
	dialplan: { context: string, priority: number, exten: string },
	creationtime: string
}