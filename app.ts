import { AsteriskAriServer } from './src/asterisk-ari-server';
import { AppLogger } from './src/logger/app-logger';
import * as dotenv from 'dotenv';
import { AriRest } from './src/asterisk-rest/ari-rest';

//.env init
dotenv.config();

// init Server
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
	});


process.on('uncaughtException', function (err) {
	console.log("Uncaught Exception:", err);
	process.exit(1);  // This is VITAL. Don't swallow the err and try to continue.
});