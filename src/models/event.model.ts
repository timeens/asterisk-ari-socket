import { EVENT_CONFIG } from '../events/events.config';
import { ParamInterface } from '../interfaces/Param.interface';
import { ErrorInterface } from '../interfaces/error.interface';
import { EventConfigInterface } from '../interfaces/event-config.interface';

export class EventModel {

	name: string;
	errors: Array<ErrorInterface> = [];

	protected eventConfig: EventConfigInterface;
	protected _params: Array<ParamInterface>;
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
		return this.errors.length === 0;
	}

	getParam(param: string) {
		return this._params[param];
	}

	protected setConfig() {
		this.eventConfig = EVENT_CONFIG.filter((e) => {
			return e.name === this.name;
		})[0];
		this._params = this.raw.params;
	}

	protected validate() {
		if (!this.raw.name) return this.addError('MISSING_EVENT_NAME', 'name:string');
		if (!this.eventConfig) return this.addError('EVENT_DOES_NOT_EXIST');
		if (!this.raw.params && this.eventConfig.requiredParams && this.eventConfig.requiredParams.length !== 0) return this.addError("EVENT_REQUIRES_PARAMETERS");
		// validate the parameters according to config
		if (this.eventConfig.requiredParams) {
			this.eventConfig.requiredParams.map(requiredParam => {
				let rawParam = this.raw.params[requiredParam.key];
				if (rawParam) {
					let val = this.raw.params[requiredParam.key];
					if (requiredParam.validate) {
						if (!requiredParam.validate(val)) this.addError(`PARAMETER_VALIDATION_ERROR`, requiredParam.key);
					}
				} else {
					this.addError(`MISSING_PARAMETER`, requiredParam.key);
				}
			});
		}
	}

	protected addError(code: any, data?: string) {
		let error: ErrorInterface = {code: code};
		if (data) error.data = data;
		this.errors.push(error);
	}
}