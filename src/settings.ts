/**
 * This is the name of the platform that users will use to register the plugin in the Homebridge config.json
 */
export const PLATFORM_NAME = 'SwitchbotBluetoothPlatform';

/**
 * This must match the name of your plugin as defined the package.json
 */
export const PLUGIN_NAME = 'homebridge-switchbot-bluetooth-platform';

export const DEFAULT_SCAN_DURATION = 5000;
export const DEFAULT_SCAN_RETRIES = 5;
export const DEFAULT_SCAN_RETRY_COOLDOWN = 1000;
export const DEFAULT_BATTERY_LEVEL = 100;
export const DEFAULT_AUTO_OFF_IN_PRESS_MODE = true;

/**
 * Cache TTL - the amount of time cached items should live
 * set to 1 day (86,400 seconds)
 */
export const CACHE_TTL = 86400;

/**
 * Amount of time to wait between each periodical check of cache items that should be deleted
 * (items with longer lifespan than the specified TTL)
 * set to 1 hour (3600 seconds)
 */
export const CHECK_CACHE_TTL_PERIOD = 3600;
