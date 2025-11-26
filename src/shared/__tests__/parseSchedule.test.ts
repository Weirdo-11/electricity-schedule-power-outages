import { describe, it, expect } from 'vitest';
import { parseSchedule } from '../parseSchedule';

describe('parseSchedule', () => {
	it('parses simple schedule line', () => {
		const raw = '🔹1.1 05:00 - 07:00, 10:00 - 12:00;';
		const schedule = parseSchedule(raw);

		expect(Object.keys(schedule)).toEqual(['1.1']);
		expect(schedule['1.1']).toEqual([
			{ from: '05:00', to: '07:00' },
			{ from: '10:00', to: '12:00' },
		]);
	});

	it('ignores links and extra text', () => {
		const raw = `
      💡Графіки на 25 листопада (https://example.com)
      Години відсутності електропостачання:
      🔹2.1 06:00 — 08:00, 12:00 — 14:00.
    `;
		const schedule = parseSchedule(raw);

		expect(schedule['2.1']).toEqual([
			{ from: '06:00', to: '08:00' },
			{ from: '12:00', to: '14:00' },
		]);
	});

	it('merges overlapping ranges and sorts by time', () => {
		const raw = '🔹3.1 06:00 - 08:00, 07:30 - 09:00, 20:00 - 21:00';
		const schedule = parseSchedule(raw);

		expect(schedule['3.1']).toEqual([
			{ from: '06:00', to: '09:00' },
			{ from: '20:00', to: '21:00' },
		]);
	});
});
