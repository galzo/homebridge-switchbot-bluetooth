import { HAP, Logging } from 'homebridge';
import {
	DEFAULT_SCAN_DURATION,
	DEFAULT_SCAN_RETRIES,
	DEFAULT_SCAN_RETRY_COOLDOWN,
} from '../settings';
import { IConfigAccessory } from '../types/accessoryTypes';
import { BotAccessory } from './botAccessory';

export class AccessoryFactory {
	private readonly hap: HAP;
	private readonly log: Logging;

	constructor(hap: HAP, log: Logging) {
		this.hap = hap;
		this.log = log;
	}

	private adaptAccessoryConfig(config: IConfigAccessory) {
		const {
			scanDuration = DEFAULT_SCAN_DURATION,
			scanRetries = DEFAULT_SCAN_RETRIES,
			scanRetryCooldown = DEFAULT_SCAN_RETRY_COOLDOWN,
		} = config;

		return {
			...config,
			bleMac: config.address.toLowerCase(),
			scanDuration,
			scanRetries,
			scanRetryCooldown,
		};
	}

	public buildFromConfig(config: IConfigAccessory) {
		const { name, type } = config;
		const accessoryParams = this.adaptAccessoryConfig(config);

		switch (type) {
			case 'bot':
				return new BotAccessory(name, this.hap, this.log, accessoryParams);
			case 'contact':
			case 'curtain':
			case 'meter':
			case 'motion':
			default:
				throw new Error('accessory is not yet supported');
		}
	}
}
