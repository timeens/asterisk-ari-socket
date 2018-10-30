import * as ws from 'ws';
import { WebsocketClient } from './websocket/websocket-client';
import { AppLogger } from './logger/app-logger';

export class AsteriskAriServer {

	protected wsServer: ws.Server;
	protected port: any;

	constructor() {
		// todo check if asterisk is available otherwise throw error!
		let WebSocketServer = ws.Server;
		this.port = process.env.SERVER_PORT || 3001;
		this.wsServer = new WebSocketServer({port: this.port});
	}

	listen() {
		AppLogger.info(`Server listening on port ${this.port}`);
		this.wsServer.on('connection', client => {
			AppLogger.info(`New client connected`);
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