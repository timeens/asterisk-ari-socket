import { EVENT_CONFIG } from '../events/events.config';
import { ParamInterface } from '../interfaces/Param.interface';
import { EventInterface } from '../interfaces/event.interface';

export class EventModel {

	name: string;
	protected eventConfig: EventInterface;
	protected _params: Array<ParamInterface>;

	errorCode: string = null;
	protected raw: any;

	constructor(jsonString: string) {
		this.raw = JSON.parse(jsonString);
		this.init();
	}

	protected init() {
		this.name = this.raw.name;
		this.setConfig();
		this.validate();
	}

	get isValid() {
		return !this.errorCode;
	}

	getParam(param: string) {
		return this._params[param];
	}

	protected validate() {
		if (!this.raw.name) this.errorCode = 'MISSING_TYPE';
		if (!this.eventConfig) this.errorCode = 'EVENT_DOES_NOT_EXIST';
		if (this.eventConfig && this.eventConfig.requiredParams) {
			this.eventConfig.requiredParams.map(required => {
				if (this.raw.params) {
					let val = this.raw.params[required.key];

					// todo validateValue

				} else {
					this.errorCode = `PARAM_MISSING => ${required.key}`
				}

			});
		}
	}

	protected setConfig() {
		this.eventConfig = EVENT_CONFIG.filter((e) => {
			return e.name === this.name;
		})[0];
		this._params = this.raw.params;
	}
}