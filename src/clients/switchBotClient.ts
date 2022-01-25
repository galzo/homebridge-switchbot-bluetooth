import { Logger } from 'homebridge';
import SwitchBot, { SwitchbotDeviceWoHand } from 'node-switchbot';
import NodeCache from 'node-cache';
import {
	DEFAULT_SCAN_RETRY_COOLDOWN,
	CACHE_TTL,
	CHECK_CACHE_TTL_PERIOD,
	DEFAULT_SCAN_RETRIES,
} from '../settings';

export class SwitchBotClient {
	private log: Logger;
	private readonly client = new SwitchBot();
	private readonly deviceCache = new NodeCache({
		stdTTL: CACHE_TTL,
		checkperiod: CHECK_CACHE_TTL_PERIOD,
		// We want to store reference to the switchbot device
		// since deep clone kills the connection to it
		useClones: false,
		deleteOnExpire: true,
	});

	constructor(log: Logger) {
		this.log = log;
	}

	public getDevice = async (
		address: string,
		scanDuration: number,
		retries = DEFAULT_SCAN_RETRIES,
		waitBetweenRetries = DEFAULT_SCAN_RETRY_COOLDOWN,
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
		retries = DEFAULT_SCAN_RETRIES,
		waitBeteenRetries = DEFAULT_SCAN_RETRY_COOLDOWN,
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

	private getDeviceFromCache = (
		address: string,
	): SwitchbotDeviceWoHand | null => {
		const device = this.deviceCache.get(address) as SwitchbotDeviceWoHand;
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
}
