import * as ws from 'ws';
import { WebsocketClient } from './websocket/websocket-client';
import { AppLogger } from './logger/app-logger';
import { InboundStasisWebsocket } from './websocket/inbound-stasis-websocket';
import * as fs from 'fs';
import * as https from 'https';

export class AsteriskAriServer {

	protected wsServer: ws.Server;
	protected inboundCallsSocket;
	protected port: any;

	constructor() {
		this.port = process.env['SERVER_PORT'] || 3001;
		this.initInboundSocket();
		this.createServer();
	}

	private createServer() {
		let WebSocketServer = ws.Server;
		if (process.env['SSL_KEY_PATH'] || process.env['SSL_CERTIFICATE_PATH']) {
			const privateKey = fs.readFileSync(process.env['SSL_KEY_PATH'], 'utf8');
			const certificate = fs.readFileSync(process.env['SSL_CERTIFICATE_PATH'], 'utf8');
			const credentials = {key: privateKey, cert: certificate};
			const httpsServer = https.createServer(credentials);
			httpsServer.listen(this.port);
			this.wsServer = new WebSocketServer({server: httpsServer});
			AppLogger.info(`Server listening on port ${this.port} (TLS protected)`);
		} else {
			this.wsServer = new WebSocketServer({port: this.port});
			AppLogger.info(`Server listening on port ${this.port} (unsecure connection)`);
		}
	}

	listen() {
		this.wsServer.on('connection', client => {
			AppLogger.info(`New client connected`);
			new WebsocketClient(client);
		});
	}

	private initInboundSocket() {
		if(process.env['INBOUND_ENABLED'] != 'true') return AppLogger.info("Inbound Socket disabled");
		this.inboundCallsSocket = new InboundStasisWebsocket();
		this.inboundCallsSocket.events.on('event', (event: string) => {
			this.wsServer.clients.forEach(client => {
				client.send(event);
			});
		});
	}

}