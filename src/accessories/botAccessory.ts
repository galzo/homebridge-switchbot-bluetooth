import {
	Service,
	HAP,
	Logging,
	CharacteristicEventTypes,
	CharacteristicGetCallback,
	CharacteristicValue,
	CharacteristicSetCallback,
	HAPStatus,
	AccessoryPlugin,
} from 'homebridge';
import { SwitchBotClient } from '../handlers/switchBotClient';
import { IAccessoryParams } from '../types/accessoryTypes';

export class BotAccessory implements AccessoryPlugin {
	private readonly switchService: Service;
	private readonly infoService: Service;
	private readonly batteryService: Service;

	private switchBotClient: SwitchBotClient;
	private isSwitchOn = false;

	constructor(
		public readonly name: string,
		private readonly hap: HAP,
		private readonly log: Logging,
		private readonly accessoryParams: IAccessoryParams,
	) {
		this.switchBotClient = new SwitchBotClient(log);

		this.switchService = new this.hap.Service.Switch(name);
		this.switchService
			.getCharacteristic(hap.Characteristic.On)
			.on(CharacteristicEventTypes.GET, this.handleGetSwitchValue)
			.on(CharacteristicEventTypes.SET, this.handleSetSwitchValue);

		this.infoService = new hap.Service.AccessoryInformation()
			.setCharacteristic(hap.Characteristic.Manufacturer, 'SwitchBot')
			.setCharacteristic(hap.Characteristic.Model, 'SWITCHBOT-S1')
			.setCharacteristic(
				hap.Characteristic.SerialNumber,
				this.accessoryParams.address,
			);

		this.batteryService = new hap.Service.Battery(`${name} Battery`);
		this.batteryService
			.getCharacteristic(hap.Characteristic.BatteryLevel)
			.onGet(this.handleGetBatteryValue);

		this.batteryService
			.getCharacteristic(hap.Characteristic.StatusLowBattery)
			.onGet(() => {
				this.log.info('getting low battery');
				return hap.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
			});
	}

	getServices(): Service[] {
		return [this.infoService, this.switchService, this.batteryService];
	}

	private handleGetBatteryValue = () => {
		const { address, scanDuration } = this.accessoryParams;
		const batteryLevel = this.switchBotClient.getDeviceBatteryStatus(
			address,
			scanDuration,
		);
		this.log.info(`Current battery level of switch is ${batteryLevel}`);
		return batteryLevel;
	};

	private handleGetSwitchValue = (callback: CharacteristicGetCallback) => {
		this.log.info(
			`Current power state of the switch is: ${this.isSwitchOn ? 'ON' : 'OFF'}`,
		);
		callback(HAPStatus.SUCCESS, this.isSwitchOn);
	};

	private handleSetSwitchValue = async (
		value: CharacteristicValue,
		callback: CharacteristicSetCallback,
	) => {
		try {
			const targetPowerMode = Boolean(value);

			const { address, scanDuration, scanRetryCooldown, scanRetries } =
				this.accessoryParams;

			const device = await this.switchBotClient.getDevice(
				address,
				scanDuration,
				scanRetries,
				scanRetryCooldown,
			);

			await this.switchBotClient.setDeviceState(
				device,
				targetPowerMode,
				scanRetries,
				scanRetryCooldown,
			);

			this.isSwitchOn = targetPowerMode;

			this.switchService
				?.getCharacteristic(this.hap.Characteristic.On)
				.updateValue(this.isSwitchOn);

			callback(HAPStatus.SUCCESS);
		} catch (e) {
			this.log.error(`${e}`);
			callback(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
		}
	};
}
