import { AsteriskAriServer } from './src/asterisk-ari-server';
import { $log } from 'ts-log-debug';
import * as dotenv from 'dotenv';

// .env init
dotenv.config();

// init Server
try {
	let server = new AsteriskAriServer();
	$log.debug('Starting up server...');
	server.listen();
} catch (err) {
	console.log("Error", err);
}