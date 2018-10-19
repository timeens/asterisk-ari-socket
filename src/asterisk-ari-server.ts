import * as ws from 'ws';
import { WebsocketClient } from './lib/websocket/websocket-client';
import { WebsocketServerEventInterface } from './interfaces/websocket-server-event.interface';
import { $log } from 'ts-log-debug';

export class AsteriskAriServer {

	protected wsServer: ws.Server;
	protected port: any;

	constructor() {
		let WebSocketServer = ws.Server;
		this.port = process.env.SERVER_PORT || 3001;
		this.wsServer = new WebSocketServer({port: this.port});
	}

	listen() {
		$log.debug(`Server listening on port ${this.port}`);
		this.wsServer.on('connection', client => {
			$log.debug(`Client connected`);
			new WebsocketClient(client);
		});
	}


	protected broadcast(event: WebsocketServerEventInterface) {
		event.isBroadcast = true;
		this.wsServer.clients.forEach(client => {
			client.send(JSON.stringify(event));
		});
	}


}