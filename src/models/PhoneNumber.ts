const PhoneNumberParser = require('awesome-phonenumber');

export class PhoneNumber {

	private raw: string;
	private parsed;

	constructor(phoneNumber: string) {
		this.raw = phoneNumber;
		this.parsed = new PhoneNumberParser(phoneNumber);
	}

	get rawNumber() {
		return this.raw;
	}

	get isValid(): boolean {
		return this.parsed.isValid();
	}

	get isMobile(): boolean {
		return this.parsed.isMobile();
	}

	get canBeInternationallyDialled(): boolean {
		return this.parsed.canBeInternationallyDialled();
	}

	get number(): string {
		return this.parsed.getNumber();
	}

	get getRegionCode(): string {
		return this.parsed.getRegionCode();
	}
}