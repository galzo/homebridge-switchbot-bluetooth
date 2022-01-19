import { SwitchbotPlatform } from './../platform/SwitchbotPlatform';
import { DEFAULT_MOVE_TIME, DEFAULT_OPEN_CLOSE_THRESHOLD, DEFAULT_SCAN_DURATION, DEFAULT_SCAN_INTERVAL } from '../settings';
import { IConfigAccessory } from '../types/accessoryTypes';

export class AccessoryFactory {
    constructor(private readonly platform: SwitchbotPlatform) {
        
    }

    private adaptAccessoryConfig(config: IConfigAccessory) {
        const {
			scanDuration = DEFAULT_SCAN_DURATION,
			scanInterval = DEFAULT_SCAN_INTERVAL,
		} = config;        

        const adaptedScanInterval = scanInterval < scanDuration ? scanDuration + 1000 : scanInterval;

        return {
            ...config,
            bleMac: config.address.toLowerCase(),
            reverseDir: config.reverseDirection || false,
            moveTime: config.moveTime || DEFAULT_MOVE_TIME,
            openCloseThreshold: config.openCloseThreshold || DEFAULT_OPEN_CLOSE_THRESHOLD,
            scanInterval: adaptedScanInterval,
            scanDuration,
        };
    }


	public buildFromConfig(config: IConfigAccessory) {
        switch (config.type) {
            return null;
        }
    };
}
