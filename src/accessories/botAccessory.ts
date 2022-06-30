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
import { MetadataClient } from '../clients/metaDataClient';
import { SwitchBotClient } from '../clients/switchBotClient';
import { IAccessoryParams } from '../types/accessoryTypes';

export class BotAccessory implements AccessoryPlugin {
	private readonly switchService: Service;
	private readonly infoService: Service;
	private readonly batteryService: Service;

	private switchBotClient: SwitchBotClient;
	private metadataClient: MetadataClient;
	private isSwitchOn = false;

	constructor(
		public readonly name: string,
		private readonly hap: HAP,
		private readonly log: Logging,
		private readonly accessoryParams: IAccessoryParams,
	) {
		this.switchBotClient = new SwitchBotClient(log);
		this.metadataClient = new MetadataClient(log);

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
			.onGet(this.getBatteryLevel);

		this.batteryService
			.getCharacteristic(hap.Characteristic.StatusLowBattery)
			.onGet(() => {
				const batteryLevel = this.getBatteryLevel();
				return batteryLevel < 20
					? hap.Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW
					: hap.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
			});
	}

	getServices(): Service[] {
		return [this.infoService, this.switchService, this.batteryService];
	}

	private getBatteryLevel = () => {
		const { address, scanDuration } = this.accessoryParams;
		const batteryLevel = this.metadataClient.getDeviceBatteryStatus(
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

	private SetPowerStateAfterDelay = (
		targetPowerState: boolean,
		delay: number,
	) => {
		setTimeout(() => {
			this.isSwitchOn = targetPowerState;
			this.switchService
				?.getCharacteristic(this.hap.Characteristic.On)
				.updateValue(targetPowerState);
		}, delay);
	};

	private setPowerState = (targetPowerState: boolean) => {
		this.isSwitchOn = targetPowerState;
		this.switchService
			?.getCharacteristic(this.hap.Characteristic.On)
			.updateValue(this.isSwitchOn);
	};

	private handleSetSwitchValue = async (
		value: CharacteristicValue,
		callback: CharacteristicSetCallback,
	) => {
		try {
			const targetPowerState = Boolean(value);

			const {
				address,
				scanDuration,
				scanRetryCooldown,
				scanRetries,
				autoTurnOffInPressMode,
			} = this.accessoryParams;

			const device = await this.switchBotClient.getDevice(
				address,
				scanDuration,
				scanRetries,
				scanRetryCooldown,
			);

			const operationMode = this.metadataClient.getDeviceOperationMode(
				address,
				scanDuration,
			);

			await this.switchBotClient.setDeviceState(
				device,
				targetPowerState,
				scanRetries,
				scanRetryCooldown,
			);

			this.setPowerState(targetPowerState);

			// In case the switchbot is configured to be in 'press' mode, and autoOff setting is enabled
			// then it the bot button should be automatically set back to 'off' mode after triggering.
			const shouldTriggerAutoOff =
				autoTurnOffInPressMode && operationMode === 'press';
			if (shouldTriggerAutoOff) {
				this.SetPowerStateAfterDelay(false, 1000);
			}

			callback(HAPStatus.SUCCESS);
		} catch (e) {
			this.log.error(`${e}`);
			callback(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
		}
	};
}
