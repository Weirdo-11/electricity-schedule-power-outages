export type TimeRange = {
	from: string;
	to: string;
};

export type Schedule = {
	ranges: Record<string, TimeRange[]>
	selectedRange?: string | null
};
