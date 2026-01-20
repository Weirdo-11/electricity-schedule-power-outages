import { TimeRange } from './types';
import { timeToMinutes } from './time';

const clampTo99_9 = (value: number): number => {
	if (value > 99.9) return 99.9;
	if (value < 0) return 0;
	return value;
};

const formatHours = (hours: number): string => {
	const v = clampTo99_9(Math.round(hours * 10) / 10);
	const [intPart, decPart] = v.toFixed(1).split('.');
	return `${intPart.padStart(2, '0')}.${decPart}`;
};

const rangeDurationMinutes = (range: TimeRange): number => {
	const start = timeToMinutes(range.from);
	let end = timeToMinutes(range.to);
	if (end <= start) end += 24 * 60;
	return end - start;
};

export const calcPowerStats = (
	ranges: TimeRange[],
): { without: string; with: string } => {
	const withoutMinutes = ranges.reduce(
		(sum, r) => sum + rangeDurationMinutes(r),
		0,
	);
	const withoutHours = withoutMinutes / 60;
	const withHours = 24 - withoutHours;

	return {
		without: formatHours(withoutHours),
		with: formatHours(withHours),
	};
};
