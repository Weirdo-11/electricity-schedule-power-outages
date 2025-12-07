import { Schedule, TimeRange } from './types';
import { normalizeTime, timeToMinutes } from './time';

const normalizeText = (text: string): string => {
	return text.replace(/\u00A0/g, ' ').replace(/[–—]/g, '-');
};

const stripLinks = (text: string): string => {
	let result = text.replace(/\((https?:\/\/[^\s)]+)\)/gi, '');
	result = result.replace(/\((?:www\.)?[^\s)]+\.[^\s)]+\)/gi, '');
	result = result.replace(/https?:\/\/[^\s]+/gi, '');
	return result;
};

const extractRangesFromPart = (part: string): TimeRange[] => {
	const ranges: TimeRange[] = [];
	const cleaned = part.trim();
	const match = cleaned.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
	if (!match) return ranges;
	const from = normalizeTime(match[1]);
	const to = normalizeTime(match[2]);
	ranges.push({ from, to });
	return ranges;
};

const mergeRanges = (ranges: TimeRange[]): TimeRange[] => {
	const sorted = [...ranges].sort(
		(a, b) => timeToMinutes(a.from) - timeToMinutes(b.from)
	);
	const result: TimeRange[] = [];
	for (const range of sorted) {
		const last = result[result.length - 1];
		if (!last) {
			result.push(range);
			continue;
		}
		const lastEnd = timeToMinutes(last.to);
		const currentStart = timeToMinutes(range.from);
		const currentEnd = timeToMinutes(range.to);
		if (currentStart <= lastEnd) {
			if (currentEnd > lastEnd) {
				last.to = range.to;
			}
		} else {
			result.push(range);
		}
	}
	return result;
};

export const parseSchedule = (raw: string): Schedule['ranges'] => {
	const text = stripLinks(normalizeText(raw));
	const lines = text.split(/\r?\n/);

	const schedule: Schedule['ranges'] = {};

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		const cleanLine = trimmed.replace(/^[^\d]+/, '').trim();
		if (!/^\d/.test(cleanLine)) continue;

		const idMatch = cleanLine.match(/^(\d+(?:\.\d+)?)/);
		if (!idMatch) continue;
		const queueId = idMatch[1];
		let rest = cleanLine.slice(idMatch[0].length).trim();
		if (!rest) continue;

		rest = rest.replace(/[;.]$/g, '').trim();

		const parts = rest
			.split(/[,;]/)
			.map((p) => p.trim())
			.filter(Boolean);

		const ranges: TimeRange[] = [];

		for (const part of parts) {
			const extracted = extractRangesFromPart(part);
			ranges.push(...extracted);
		}

		if (!ranges.length) continue;

		const merged = mergeRanges(ranges);
		if (!merged.length) continue;

		schedule[queueId] = merged;
	}

	return schedule;
};
