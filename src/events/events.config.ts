import { EventConfigInterface } from '../interfaces/event-config.interface';
import { PhoneNumber } from '../models/PhoneNumber';
import { isString } from 'util';

export const EVENT_CONFIG: Array<EventConfigInterface> = [
	{
		name: 'HANDSHAKE',
		requiredParams: [
			{
				key: 'sipNr',
				validate: function (val) {
					return Number.isInteger(parseInt(val));
				},
			},
		]
	},
	{
		name: 'OUTBOUND_CALL',
		requiredParams: [
			{
				key: 'remoteEndpoint',
				validate: function (val) {
					// todo error in this class!!!
					let phone = new PhoneNumber(val);
					return phone.isValid;
				}
			},
			{
				key: 'displayName',
				validate: function (val) {
					return (typeof val === 'string');
				},
			}
		]
	},
	{
		name: 'HANGUP',
	}
];