import { API } from 'homebridge';
import { SwitchbotPlatform } from './platform/SwitchbotPlatform';
import { PLATFORM_NAME } from './settings';

export = (api: API) => {
	api.registerPlatform(PLATFORM_NAME, SwitchbotPlatform);
};
