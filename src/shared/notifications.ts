const isWindowAvailable = () => typeof window !== 'undefined';

export const isNotificationSupported = (): boolean => {
	return isWindowAvailable() && 'Notification' in window;
};

export const requestNotificationPermission =
	async (): Promise<NotificationPermission> => {
		if (!isNotificationSupported()) return 'denied';
		if (Notification.permission === 'default') {
			return Notification.requestPermission();
		}
		return Notification.permission;
	};

export const canSendNotification = (): boolean => {
	return isNotificationSupported() && Notification.permission === 'granted';
};

type SendOptions = {
	body?: string;
	tag?: string;
};

export const sendNotification = (
	title: string,
	options?: SendOptions
): void => {
	if (!canSendNotification()) return;
	new Notification(title, {
		body: options?.body,
		tag: options?.tag,
	});
};
