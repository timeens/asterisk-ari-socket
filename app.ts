import { AsteriskAriServer } from './src/asterisk-ari-server';
import { AppLogger } from './src/logger/app-logger';
import * as dotenv from 'dotenv';
import { AriRest } from './src/asterisk-rest/ari-rest';

//.env init
dotenv.config();

// init Server
try {
	AppLogger.info('Starting up server...');
	let rest = new AriRest();
	rest.restAsterisk.isAvailable()
		.then((asteriskVersion) => {
			AppLogger.info(`Asterisk ready: Version: ${asteriskVersion}`);
			let server = new AsteriskAriServer();
			server.listen();
		})
		.catch(err => {
			throw Error(err);
		})
} catch (err) {
	console.log("Error", err);
}