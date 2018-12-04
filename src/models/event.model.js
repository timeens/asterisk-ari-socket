import { EVENT_CONFIG } from '../events/events.config';
export class EventModel {
    constructor(jsonString) {
        this.errors = [];
        this.raw = JSON.parse(jsonString);
        this.init();
    }
    init() {
        this.name = this.raw.name;
        this.setConfig();
        this.validate();
    }
    get isValid() {
        return this.errors.length === 0;
    }
    getParam(param) {
        return this._params[param];
    }
    setConfig() {
        this.eventConfig = EVENT_CONFIG.filter((e) => {
            return e.name === this.name;
        })[0];
        this._params = this.raw.params;
    }
    validate() {
        if (!this.raw.name)
            return this.addError('MISSING_EVENT_NAME', 'name:string');
        if (!this.eventConfig)
            return this.addError('EVENT_DOES_NOT_EXIST');
        if (!this.raw.params && this.eventConfig.requiredParams && this.eventConfig.requiredParams.length !== 0)
            return this.addError("EVENT_REQUIRES_PARAMETERS", `Required: [{${this.eventConfig.requiredParams[0].key}:value}]`);
        // validate the parameters according to config
        if (this.eventConfig.requiredParams) {
            this.eventConfig.requiredParams.map(requiredParam => {
                let rawParam = this.raw.params[requiredParam.key];
                if (rawParam) {
                    let val = this.raw.params[requiredParam.key];
                    if (requiredParam.validate) {
                        if (!requiredParam.validate(val))
                            this.addError(`PARAMETER_VALIDATION_ERROR`, requiredParam.key);
                    }
                }
                else {
                    this.addError(`MISSING_PARAMETER`, requiredParam.key);
                }
            });
        }
    }
    addError(code, data) {
        let error = { code: code };
        if (data)
            error.data = data;
        this.errors.push(error);
    }
}
