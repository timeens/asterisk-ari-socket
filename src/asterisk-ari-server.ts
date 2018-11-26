import * as ws from 'ws';
import { WebsocketClient } from './websocket/websocket-client';
import { AppLogger } from './logger/app-logger';
import { InboundStasisWebsocket } from './websocket/inbound-stasis-websocket';

export class AsteriskAriServer {

	protected wsServer: ws.Server;
	protected inboundCallsSocket;
	protected port: any;

	constructor() {
		let WebSocketServer = ws.Server;
		this.port = process.env['SERVER_PORT'] || 3001;
		this.wsServer = new WebSocketServer({port: this.port});
		this.initInboundSocket();
	}

	listen() {
		AppLogger.info(`Server listening on port ${this.port}`);
		this.wsServer.on('connection', client => {
			AppLogger.info(`New client connected`);
			new WebsocketClient(client);
		});
	}

	initInboundSocket() {
		this.inboundCallsSocket = new InboundStasisWebsocket();
		this.inboundCallsSocket.events.on('event', (event: string) => {
			this.wsServer.clients.forEach(client => {
				client.send(event);
			});
		});
	}

}