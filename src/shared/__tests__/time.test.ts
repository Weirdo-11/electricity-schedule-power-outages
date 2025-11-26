import { describe, it, expect } from 'vitest';
import {
	normalizeTime,
	timeToMinutes,
	findActiveAndNearestRange,
} from '../time';
import { TimeRange } from '../types';

describe('normalizeTime', () => {
	it('pads hours and keeps minutes', () => {
		expect(normalizeTime('5:00')).toBe('05:00');
		expect(normalizeTime('15:30')).toBe('15:30');
	});

	it('keeps 24:00 as 24:00', () => {
		expect(normalizeTime('24:00')).toBe('24:00');
	});

	it('returns original string for invalid input', () => {
		expect(normalizeTime('test')).toBe('test');
	});
});

describe('timeToMinutes', () => {
	it('converts hh:mm to minutes', () => {
		expect(timeToMinutes('00:00')).toBe(0);
		expect(timeToMinutes('01:00')).toBe(60);
		expect(timeToMinutes('10:30')).toBe(10 * 60 + 30);
	});

	it('handles 24:00 as end of day', () => {
		expect(timeToMinutes('24:00')).toBe(24 * 60);
	});

	it('returns 0 for invalid values', () => {
		expect(timeToMinutes('invalid')).toBe(0);
	});
});

describe('findActiveAndNearestRange', () => {
	const ranges: TimeRange[] = [
		{ from: '06:00', to: '08:00' },
		{ from: '10:00', to: '12:00' },
		{ from: '18:00', to: '20:00' },
	];

	it('finds active range when now is inside', () => {
		const { activeIndex, nearestIndex } = findActiveAndNearestRange(
			ranges,
			10 * 60 + 30
		);
		expect(activeIndex).toBe(1);
		expect(nearestIndex).toBe(1);
	});

	it('finds nearest future range when before all', () => {
		const { activeIndex, nearestIndex } = findActiveAndNearestRange(
			ranges,
			5 * 60
		);
		expect(activeIndex).toBeNull();
		expect(nearestIndex).toBe(0);
	});

	it('finds nearest future range when between ranges', () => {
		const { activeIndex, nearestIndex } = findActiveAndNearestRange(
			ranges,
			9 * 60
		);
		expect(activeIndex).toBeNull();
		expect(nearestIndex).toBe(1);
	});

	it('returns null nearest when after all ranges', () => {
		const { activeIndex, nearestIndex } = findActiveAndNearestRange(
			ranges,
			23 * 60
		);
		expect(activeIndex).toBeNull();
		expect(nearestIndex).toBeNull();
	});

	it('returns nulls for empty ranges', () => {
		const { activeIndex, nearestIndex } = findActiveAndNearestRange(
			[],
			600
		);
		expect(activeIndex).toBeNull();
		expect(nearestIndex).toBeNull();
	});
});
