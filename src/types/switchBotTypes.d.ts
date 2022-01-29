declare module 'node-switchbot' {
	/**
	 * "H", "T" or "c". If "H" is specified,
	 * this method will discover only Bots.
	 * If "T" is specified, this method will discover only Meters.
	 * If "c" is specified, this method will discover only Curtains.
	 */
	export type ModelType = 'H' | 'T' | 'C';
	export type ModelName = 'WoHand' | 'WoSensorTH';
	export type ConnectionState =
		| 'connecting'
		| 'connected'
		| 'disconnecting'
		| 'disconnected';

	/**
	 * The SwitchbotDevice object represents a Switchbot device (Bot or Meter),
	 * which is created through the discovery process triggered by the Switchbot.discover() method.
	 */
	export interface SwitchBotDevice {
		id: string;
		address: string;
		model: ModelType;
		modelName: ModelName;
		connectionState: ConnectionState;
		onConnect: () => void;
		onDisconnect: () => void;
	}

	/**
	 * The SwitchbotDeviceWoHand object represents an Bot, which is created through the discovery process
	 * triggered by the Switchbot.discover() method.
	 * Actually, the SwitchbotDeviceWoHand is an object inherited from the SwitchbotDevice.
	 * You can use not only the method described in this section but also the
	 * properties and methods implemented in the SwitchbotDevice object.
	 */
	export interface SwitchbotDeviceWoHand extends SwitchBotDevice {
		press: () => Promise<void>;
		turnOn: () => Promise<void>;
		turnOff: () => Promise<void>;
		up: () => Promise<void>;
		down: () => Promise<void>;
	}

	export interface AdvertisementData {
		id: string;
		address: string;
		rssi: number;
		serviceData: ServiceData;
	}

	export interface ServiceData {
		model: ModelType;
		modelName: ModelName;
		battery: number;
		/**
		 * This indicates the mode setting.
		 * When the mode is "Switch mode",
		 * this value is true.
		 * When the mode is "Press mode", this value is false.
		 */
		mode: boolean;
	}

	export default class SwitchBot {
		discover: (props: {
			duration: number;
			model: ModelType;
			quick: boolean;
			id: string;
		}) => Promise<any>;

		startScan: (props: { model?: ModelType; id?: string }) => Promise<void>;
		stopScan: () => void;

		onadvertisement: (data: AdvertisementData) => void;
		wait: (waitMs: number) => Promise<void>;
	}
}
