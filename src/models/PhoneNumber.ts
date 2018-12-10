const PhoneNumberParser = require('awesome-phonenumber');

export class PhoneNumber {

	private raw: string;
	private parsed;
	private _isInternal: boolean = false;

	constructor(phoneNumber: string) {
		phoneNumber = this.customSanitizing(phoneNumber);
		this.isInternal = phoneNumber;
		this.raw = phoneNumber;
		if (!this.isInternal) this.parsed = new PhoneNumberParser(phoneNumber);
	}

	get rawNumber() {
		return this.raw;
	}

	get isValid(): boolean {
		if (this.isInternal) return true;
		return this.parsed.isValid();
	}

	get isMobile(): boolean {
		return this.parsed.isMobile();
	}

	get canBeInternationallyDialled(): boolean {
		return this.parsed.canBeInternationallyDialled();
	}

	get number(): string {
		if (this.isInternal) return this.rawNumber;
		return this.parsed.getNumber();
	}

	get getRegionCode(): string {
		return this.parsed.getRegionCode();
	}

	set isInternal(phoneNumber: any) {
		this._isInternal = Number.isInteger(Number.parseInt(phoneNumber)) && phoneNumber.length <= 4;
	}

	get isInternal() {
		return this._isInternal;
	}


	private customSanitizing(phoneNumber: string | number): string {
		// leading 00 have to be transformed to +
		if (typeof phoneNumber !== 'string') phoneNumber = phoneNumber.toString();
		if (typeof phoneNumber === 'string' && !Number.parseInt(phoneNumber.charAt(0)) && !Number.parseInt(phoneNumber.charAt(1))) phoneNumber = `+${phoneNumber.slice(2)}`;

		return phoneNumber;
	}
}