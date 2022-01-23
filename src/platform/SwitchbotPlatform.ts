import {
	AccessoryPlugin,
	API,
	Logging,
	PlatformConfig,
	StaticPlatformPlugin,
} from 'homebridge';
import { IConfigAccessory } from '../types/accessoryTypes';
import { AccessoryFactory } from '../accessories/accessoryFactory';

export class SwitchbotPlatform implements StaticPlatformPlugin {
	private readonly log: Logging;
	private readonly config: PlatformConfig;
	private readonly api: API;

	private readonly accessoryFactory: AccessoryFactory;

	constructor(log: Logging, config: PlatformConfig, api: API) {
		this.log = log;
		this.config = config;
		this.api = api;
		this.accessoryFactory = new AccessoryFactory(this.api.hap, this.log);
		this.log.info('SwitchBot Platform Initializing');
	}

	private logDevice = (config: IConfigAccessory) => {
		this.log.debug(config.type);
		this.log.debug(config.name);
		this.log.debug(config.address);
	};

	private resolveDevicesFromConfig = (): AccessoryPlugin[] => {
		const { devices } = this.config;
		if (!devices) {
			return [];
		}

		return this.config.devices.map((config: IConfigAccessory) => {
			this.logDevice(config);
			return this.accessoryFactory.buildFromConfig(config);
		});
	};

	/*
	 * This method is called to retrieve all accessories exposed by the platform.
	 * The Platform can delay the response by invoking the callback at a later time,
	 * it will delay the bridge startup though, so keep it to a minimum.
	 * The set of exposed accessories CANNOT change over the lifetime of the plugin!
	 */
	public accessories(
		callback: (foundAccessories: AccessoryPlugin[]) => void,
	): void {
		const deviceList = this.resolveDevicesFromConfig();
		const deviceCount = deviceList.length;

		if (!deviceCount) {
			this.log.error('No Devices were defined in config');
		}

		this.log(`Initialized SwitchBot devices. device count: ${deviceCount}`);
		callback(deviceList);
	}
}
