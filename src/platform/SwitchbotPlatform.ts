import {
	AccessoryPlugin,
	API,
	Characteristic,
	Logging,
	PlatformConfig,
	Service,
	StaticPlatformPlugin,
} from 'homebridge';
import { IConfigAccessory } from '../types/accessoryTypes';
import { AccessoryFactory } from '../accessories/accessoryFactory';

export class SwitchbotPlatform implements StaticPlatformPlugin {
	private readonly log: Logging;
	private readonly config: PlatformConfig;
	private readonly api: API;

	private readonly service: typeof Service;
	private readonly characteristic: typeof Characteristic;
	private readonly accessoryFactory: AccessoryFactory;

	constructor(log: Logging, config: PlatformConfig, api: API) {
		this.log = log;
		this.config = config;
		this.api = api;
		this.service = this.api.hap.Service;
		this.characteristic = this.api.hap.Characteristic;
		this.accessoryFactory = new AccessoryFactory(this.api.hap, this.log);
		this.log.info('SwitchBot Platform Initializing');
	}

	private logDevice = (device: IConfigAccessory) => {
		this.log.debug(device.type);
		this.log.debug(device.name);
		this.log.debug(device.address);
	};

	private resolveDevicesFromConfig = (): AccessoryPlugin[] => {
		const configDevices = this.config.devices;
		if (!configDevices) {
			return [];
		}

		return this.config.devices.map((device: IConfigAccessory) => []);
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
		// const deviceList = this.resolveDeviceListFromConfig();
		// const deviceCount = deviceList.length;
		// if (!deviceCount) {
		// 	this.log.error('No Device Set In Config');
		// }
		// this.log(`Device Count: ${deviceCount}`);
		// callback(deviceList);
	}
}
