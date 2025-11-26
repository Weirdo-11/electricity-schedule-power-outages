export type TimeRange = {
	from: string;
	to: string;
};

export type Schedule = Record<string, TimeRange[]>;
