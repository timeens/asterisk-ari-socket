const PhoneNumberParser = require('awesome-phonenumber');

export class PhoneNumber {

	private raw: string;
	private parsed;
	private _isInternal: boolean = false;

	constructor(phoneNumber: string) {
		this.internal = phoneNumber;
		this.raw = phoneNumber;
		this.parsed = new PhoneNumberParser(phoneNumber);
	}

	get rawNumber() {
		return this.raw;
	}

	get isValid(): boolean {
		if (this.internal) return true;
		return this.parsed.isValid();
	}

	get isMobile(): boolean {
		return this.parsed.isMobile();
	}

	get canBeInternationallyDialled(): boolean {
		return this.parsed.canBeInternationallyDialled();
	}

	get number(): string {
		if (this.internal) return this.rawNumber;
		return this.parsed.getNumber();
	}

	get getRegionCode(): string {
		return this.parsed.getRegionCode();
	}

	set internal(phoneNumber: any) {
		this._isInternal = (phoneNumber.length <= 4 && Number.isInteger(Number.parseInt(phoneNumber)));
	}

	get internal() {
		return this._isInternal;
	}
}