const PREFIX = 'electricity-schedule-notif-';
const ENABLED_KEY = 'electricity-schedule-notif-enabled';

const isWindowAvailable = () => typeof window !== 'undefined';

export const makeRangeKey = (
	dateKey: string,
	queueId: string,
	from: string
): string => {
	return `${PREFIX}${dateKey}-${queueId}-${from}`;
};

export const wasRangeNotified = (key: string): boolean => {
	if (!isWindowAvailable()) return false;
	return window.localStorage.getItem(key) === '1';
};

export const markRangeNotified = (key: string): void => {
	if (!isWindowAvailable()) return;
	window.localStorage.setItem(key, '1');
};

export const getNotificationsFlag = (): boolean => {
	if (!isWindowAvailable()) return false;
	return window.localStorage.getItem(ENABLED_KEY) === '1';
};

export const setNotificationsFlag = (enabled: boolean): void => {
	if (!isWindowAvailable()) return;
	if (enabled) {
		window.localStorage.setItem(ENABLED_KEY, '1');
	} else {
		window.localStorage.removeItem(ENABLED_KEY);
	}
};
