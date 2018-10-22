import { EventInterface } from '../interfaces/event.interface';

export const EVENT_CONFIG: Array<EventInterface> = [
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
				key: 'phoneNb',
				// todo add validation for phone nb's...
			}
		]
	}
];