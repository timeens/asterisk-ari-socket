import { EventConfigInterface } from '../interfaces/event-config.interface';
import { PhoneNumber } from '../models/PhoneNumber';

export const EVENT_CONFIG: Array<EventConfigInterface> = [
	{
		name: 'HANDSHAKE',
		requiredParams: [
			{
				key: 'sipNr',
				validate: function (val) {
					return Number.isInteger(parseInt(val));
				}
			}
		]
	},
	{
		name: 'OUTBOUND_CALL',
		requiredParams: [
			{
				key: 'remoteEndpoint',
				validate: function (val) {
					let phone = new PhoneNumber(val);
					return phone.isValid;
				}
			}
		]
	},
	{
		name: 'HANGUP',
	}
];