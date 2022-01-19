// Future proofing, we'll add support for more than the bot
export type AccessoryType = 'bot' | 'curtain' | 'meter' | 'motion' | 'contact';

export interface IConfigAccessory {
	type: AccessoryType;
	name: string;
	address: string;
	scanDuration?: number;
	scanRetries?: number;
	scanRetryCooldown?: number;
	scanInterval?: number;
	reverseDirection?: boolean;
	moveTime?: number;
	openCloseThreshold?: number;
}

export interface IAccessoryParams {
	address: string;
	scanDuration: number;
	scanRetryCooldown: number;
	scanRetries: number;
	reverseDirection: boolean;
}
