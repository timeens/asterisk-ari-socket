import * as ws from 'ws';
import { $log } from 'ts-log-debug';
import { WebsocketClient } from './websocket/websocket-client';

export class AsteriskAriServer {

	protected wsServer: ws.Server;
	protected port: any;

	constructor() {
		let WebSocketServer = ws.Server;
		this.port = process.env.SERVER_PORT || 3001;
		this.wsServer = new WebSocketServer({port: this.port});
		// todo check if asterisk is available otherwise throw error!
	}

	listen() {
		$log.debug(`Server listening on port ${this.port}`);
		this.wsServer.on('connection', client => {
			$log.debug(`New client connected`);
			new WebsocketClient(client);
		});
	}


	// protected broadcast(event: WebsocketServerEventInterface) {
	// 	event.isBroadcast = true;
	// 	this.wsServer.clients.forEach(client => {
	// 		client.send(JSON.stringify(event));
	// 	});
	// }


}