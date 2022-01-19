import {
	AccessoryPlugin,
	API,
	Characteristic,
	Logger,
	PlatformConfig,
	Service,
	StaticPlatformPlugin,
} from 'homebridge';
import { AccessoryFactory } from '../accessories/accessoryFactory';

export class SwitchbotPlatform implements StaticPlatformPlugin {
	public readonly Service: typeof Service = this.api.hap.Service;
	public readonly Characteristic: typeof Characteristic =
		this.api.hap.Characteristic;

	private readonly AccessoryFactory = new AccessoryFactory();

	/**
	 *
	 */
	constructor(
		public readonly log: Logger,
		public readonly config: PlatformConfig,
		public readonly api: API,
	) {
		this.log.debug('launching stuff');
	}

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
