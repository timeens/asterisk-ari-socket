export interface CallInterface {
	outboundNumber: string;
	displayName: string;
	channels: {
		inboundUid: number,
		outboundUid: number;
	},
	bridgeUid: string;
}