import { AsteriskAriServer } from './src/asterisk-ari-server';
import { AppLogger } from './src/logger/app-logger';
import * as dotenv from 'dotenv';

// .env init
dotenv.config();

// init Server
try {
	let server = new AsteriskAriServer();
	AppLogger.info('Starting up server...');
	server.listen();
} catch (err) {
	console.log("Error", err);
}