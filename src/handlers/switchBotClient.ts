import { Logger } from 'homebridge';
import SwitchBot, {
	AdvertisementData,
	SwitchbotDeviceWoHand,
} from 'node-switchbot';
import { DEFAULT_BATTERY_LEVEL } from '../settings';

export class SwitchBotClient {
	private log: Logger;
	private readonly client = new SwitchBot();
	private readonly deviceCache = new Map<string, SwitchbotDeviceWoHand>();
	private readonly deviceMetaData = new Map<string, AdvertisementData>();
	private isScanningForMetadata = false;

	constructor(log: Logger) {
		this.log = log;
		this.client.onadvertisement = this.setDeviceMetaDataOnCache;
	}

	public getDevice = async (
		address: string,
		scanDuration: number,
		retries = 5,
		waitBetweenRetries = 500,
	): Promise<SwitchbotDeviceWoHand> => {
		this.log.info(`Getting SwitchBot device (address ${address})`);

		const deviceFromCache = this.getDeviceFromCache(address);
		if (deviceFromCache) {
			return deviceFromCache;
		}

		return this.attemptRun(
			async () => this.getDeviceFromScan(address, scanDuration),
			retries,
			waitBetweenRetries,
		);
	};

	public setDeviceState = async (
		device: SwitchbotDeviceWoHand,
		targetState: boolean,
		retries = 5,
		waitBeteenRetries = 500,
	) => {
		const setState = async () => {
			this.log.info(
				`Updating SwitchBot device (id ${device.address}) power state to ${
					targetState ? 'ON' : 'OFF'
				}`,
			);
			if (targetState) {
				return device.turnOn();
			}

			return device.turnOff();
		};

		return this.attemptRun(setState, retries, waitBeteenRetries);
	};

	public getDeviceBatteryStatus = (address: string, scanDuration: number) => {
		this.log.info(`Getting Battery level for device (address ${address})`);

		const metaData = this.getDeviceMetaDataFromCache(address);
		if (!metaData && !this.isScanningForMetadata) {
			this.log.info(
				`No battery level details found for device (address ${address})`,
			);
			this.scanForDeviceMetaData(address, scanDuration);
		}

		return metaData?.serviceData?.battery ?? DEFAULT_BATTERY_LEVEL;
	};

	private scanForDeviceMetaData = async (
		address: string,
		scanDuration: number,
	) => {
		this.log.info(`Scanning for device metadata (address ${address})`);
		this.isScanningForMetadata = true;

		await this.client.startScan({ model: 'H', id: address });
		await this.client.wait(scanDuration);
		this.client.stopScan();

		this.isScanningForMetadata = false;
		this.log.info(`Finished scanning for device metadata (address ${address})`);
	};

	private getDeviceFromScan = async (
		address: string,
		scanDuration: number,
		shouldCache = true,
	) => {
		this.log.info(`Scanning for SwitchBot device (address ${address})`);

		const scannedDevices: SwitchbotDeviceWoHand[] = await this.client.discover({
			duration: scanDuration,
			model: 'H',
			quick: true,
			id: address,
		});

		const noDeviceFound = !scannedDevices || scannedDevices.length <= 0;
		if (noDeviceFound) {
			throw new Error(`No Device found for address ${address}`);
		}

		const targetDevice = scannedDevices[0];
		this.log.info(`Found SwitchBot device (address ${address})`);

		if (shouldCache) {
			this.setDeviceOnCache(address, targetDevice);
		}
		return targetDevice;
	};

	private getDeviceFromCache = (address: string) => {
		const device = this.deviceCache.get(address);
		if (device) {
			this.log.info(`Found SwitchBot device (address ${address}) on cache.`);
			return device;
		}

		this.log.info(
			`No SwitchBot device (address ${address}) was found on cache.`,
		);
		return null;
	};

	private setDeviceOnCache = (
		address: string,
		device: SwitchbotDeviceWoHand,
	) => {
		this.log.info(`Setting device (address ${address}) on cache.`);
		this.deviceCache.set(address, device);
	};

	private async attemptRun<T>(
		action: () => Promise<T>,
		retries: number,
		waitBetweenRetries: number,
	): Promise<T> {
		try {
			const actionResult = await action();
			return actionResult;
		} catch (e) {
			if (retries <= 0) {
				throw e;
			}

			this.log.info(`Failed attempt, Retrying. retries left: ${retries - 1}`);
			this.log.info(`Waiting ${waitBetweenRetries}ms before next retry`);
			await this.client.wait(waitBetweenRetries);

			return this.attemptRun<T>(action, retries - 1, waitBetweenRetries);
		}
	}

	private getDeviceMetaDataFromCache = (
		address: string,
	): AdvertisementData | undefined => this.deviceMetaData.get(address);

	private setDeviceMetaDataOnCache = (data: AdvertisementData) => {
		this.log.info(
			`Found device metadata during scan. setting on cache. (address ${data.address}`,
		);
		this.deviceMetaData.set(data.address, data);
	};
}
