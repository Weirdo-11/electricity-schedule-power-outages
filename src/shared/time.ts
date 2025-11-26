import { TimeRange } from './types';

export const normalizeTime = (value: string): string => {
	const trimmed = value.trim();
	const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
	if (!match) return trimmed;
	let hours = parseInt(match[1], 10);
	const minutes = parseInt(match[2], 10);
	if (hours === 24 && minutes === 0) hours = 24;
	const h = hours.toString().padStart(2, '0');
	const m = minutes.toString().padStart(2, '0');
	return `${h}:${m}`;
};

export const timeToMinutes = (value: string): number => {
	const match = value.match(/^(\d{1,2}):(\d{2})$/);
	if (!match) return 0;
	let hours = parseInt(match[1], 10);
	const minutes = parseInt(match[2], 10);
	if (hours === 24 && minutes === 0) hours = 24;
	return hours * 60 + minutes;
};

export const getNowMinutes = (): number => {
	const now = new Date();
	return now.getHours() * 60 + now.getMinutes();
};

export const findActiveAndNearestRange = (
	ranges: TimeRange[],
	nowMinutes: number
): { activeIndex: number | null; nearestIndex: number | null } => {
	if (!ranges.length) {
		return { activeIndex: null, nearestIndex: null };
	}

	let activeIndex: number | null = null;
	let nearestIndex: number | null = null;
	let minStartDiff = Infinity;

	ranges.forEach((range, index) => {
		const start = timeToMinutes(range.from);
		const end = timeToMinutes(range.to);

		if (nowMinutes >= start && nowMinutes < end && activeIndex === null) {
			activeIndex = index;
		}

		if (start > nowMinutes) {
			const diff = start - nowMinutes;
			if (diff < minStartDiff) {
				minStartDiff = diff;
				nearestIndex = index;
			}
		}
	});

	if (activeIndex !== null) {
		nearestIndex = activeIndex;
	}

	return { activeIndex, nearestIndex };
};
