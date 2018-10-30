import { RestEndpointsSip } from './resources/rest-endpoints-sip';
import { RestChannels } from './resources/rest-channels';
import { RestBridges } from './resources/rest-bridges';
import { RestEvents } from './resources/rest-events';
import { RestApplications } from './resources/rest-applications';

export class AriRest {

	restEndpointSip: RestEndpointsSip;
	restChannels: RestChannels;
	restBridges: RestBridges;
	restEvents: RestEvents;
	restApplications: any;

	constructor() {
		this.restEndpointSip = new RestEndpointsSip();
		this.restChannels = new RestChannels();
		this.restBridges = new RestBridges();
		this.restEvents = new RestEvents();
		this.restApplications = new RestApplications();
	}
}