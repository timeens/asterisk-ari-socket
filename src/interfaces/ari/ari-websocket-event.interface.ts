import { AriChannelInterface } from './ari-channel.interface';

export interface AriWebsocketEventInterface {
	forward: string,
	type: 'StasisStart' | 'StasisEnd' | 'Dial' | 'ChannelVarset' | 'ChannelDestroyed',
	asterisk_id: string,
	timestamp: string,
	peer?: AriChannelInterface,
	// peer is called channel if the type is ChannelDestroyed, it has the exact same properties
	channel?: AriChannelInterface,
	dialstatus: string,
	dialstring: string,
	application: string
}