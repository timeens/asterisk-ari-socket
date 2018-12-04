const PhoneNumberParser = require('awesome-phonenumber');
export class PhoneNumber {
    constructor(phoneNumber) {
        this._isInternal = false;
        phoneNumber = this.customSanitizing(phoneNumber);
        this.isInternal = phoneNumber;
        this.raw = phoneNumber;
        if (!this.isInternal)
            this.parsed = new PhoneNumberParser(phoneNumber);
    }
    get rawNumber() {
        return this.raw;
    }
    get isValid() {
        if (this.isInternal)
            return true;
        return this.parsed.isValid();
    }
    get isMobile() {
        return this.parsed.isMobile();
    }
    get canBeInternationallyDialled() {
        return this.parsed.canBeInternationallyDialled();
    }
    get number() {
        if (this.isInternal)
            return this.rawNumber;
        return this.parsed.getNumber();
    }
    get getRegionCode() {
        return this.parsed.getRegionCode();
    }
    set isInternal(phoneNumber) {
        this._isInternal = Number.isInteger(Number.parseInt(phoneNumber)) && phoneNumber.length <= 4;
    }
    get isInternal() {
        return this._isInternal;
    }
    customSanitizing(phoneNumber) {
        // leading 00 have to be transformed to +
        if (!Number.parseInt(phoneNumber[0]) && !Number.parseInt(phoneNumber[1]))
            phoneNumber = `+${phoneNumber.slice(2)}`;
        return phoneNumber;
    }
}
