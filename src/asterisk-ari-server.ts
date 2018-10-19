import * as ws from 'ws';
import { WebsocketClient } from './lib/websocket/websocket-client';
import { WebsocketServerEventInterface } from './interfaces/websocket-server-event.interface';

export class AsteriskAriServer {

	wsServer: ws.Server;
	clients = [];

	constructor() {
		let WebSocketServer = ws.Server;
		let port: any = process.env.SERVER_PORT || 3001;
		this.wsServer = new WebSocketServer({port: port});

		this.listen();
	}

	listen() {
		this.wsServer.on('connection', client => {
			new WebsocketClient(client);
		});
	}


	broadcast(event: WebsocketServerEventInterface) {
		event.isBroadcast = true;
		this.wsServer.clients.forEach(client => {
			client.send(JSON.stringify(event));
		});
	}


}