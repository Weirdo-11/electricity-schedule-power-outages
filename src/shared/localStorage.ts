import { Schedule } from './types';

const STORAGE_KEY = 'electricity-schedule';

export const saveSchedule = (schedule: Schedule): void => {
	try {
		if (typeof window === 'undefined') return;
		const serialized = JSON.stringify(schedule);
		window.localStorage.setItem(STORAGE_KEY, serialized);
	} catch {
		/* empty */
	}
};

export const loadSchedule = (): Schedule | null => {
	try {
		if (typeof window === 'undefined') return null;
		const serialized = window.localStorage.getItem(STORAGE_KEY);
		if (!serialized) return null;
		const parsed = JSON.parse(serialized) as Schedule;
		return parsed;
	} catch {
		return null;
	}
};
