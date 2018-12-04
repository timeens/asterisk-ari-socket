import { RestEndpointsSip } from './resources/rest-endpoints-sip';
import { RestChannels } from './resources/rest-channels';
import { RestBridges } from './resources/rest-bridges';
import { RestEvents } from './resources/rest-events';
import { RestApplications } from './resources/rest-applications';
import { RestAsterisk } from './resources/rest-asterisk';
export class AriRest {
    constructor() {
        this.restEndpointSip = new RestEndpointsSip();
        this.restChannels = new RestChannels();
        this.restBridges = new RestBridges();
        this.restEvents = new RestEvents();
        this.restApplications = new RestApplications();
        this.restAsterisk = new RestAsterisk();
    }
}
