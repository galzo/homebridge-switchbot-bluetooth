// Future proofing, we'll add support for more than the bot
export type AccessoryType = 'bot' | 'curtain' | 'meter' | 'motion' | 'contact';
export type SwitchbotOperationMode = 'switch' | 'press';

export interface IConfigAccessory {
	type: AccessoryType;
	name: string;
	address: string;
	scanDuration?: number;
	scanRetries?: number;
	scanRetryCooldown?: number;
	autoTurnOffInPressMode?: boolean;
}

export interface IAccessoryParams {
	address: string;
	scanDuration: number;
	scanRetryCooldown: number;
	scanRetries: number;
	autoTurnOffInPressMode: boolean;
}
