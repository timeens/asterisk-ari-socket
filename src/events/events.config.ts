import { EventInterface } from '../interfaces/event.interface';

export const EVENT_CONFIG: Array<EventInterface> = [
	{
		name: 'HANDSHAKE',
		requiredParams: [
			{
				key: 'sipNr',
				type: 'number'
			}
		]
	}
];