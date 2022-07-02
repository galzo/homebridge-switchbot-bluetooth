import { Logger } from 'homebridge';

export const logSwitchbotClientError = (logger: Logger, error: any) => {
	const errorMessage = `${error}`;

	const isInitializationError = errorMessage
		?.toLowerCase()
		?.includes('failed to initialize');

	if (isInitializationError) {
		logger.error(
			'Failed initializing switchbot client. Please make sure that the bluetooth is accessible on your homebridge server',
		);
	}

	logger.error(errorMessage);
};
