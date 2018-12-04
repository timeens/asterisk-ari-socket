import { PhoneNumber } from '../models/PhoneNumber';
export const EVENT_CONFIG = [
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
