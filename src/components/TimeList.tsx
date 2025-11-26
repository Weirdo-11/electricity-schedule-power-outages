import { FC } from 'react';
import { TimeRange } from '../shared/types';
import {
	findActiveAndNearestRange,
	getNowMinutes,
	timeToMinutes,
} from '../shared/time';

type Props = {
	queueId: string | null;
	ranges: TimeRange[];
};

type RangeItem = {
	range: TimeRange;
	index: number;
};

const TimeList: FC<Props> = ({ queueId, ranges }) => {
	if (!queueId) {
		return (
			<div className='rounded-2xl bg-slate-900/70 p-4 text-sm text-slate-300'>
				Обери чергу, щоб побачити години відключення.
			</div>
		);
	}

	if (!ranges.length) {
		return (
			<div className='rounded-2xl bg-slate-900/70 p-4 text-sm text-slate-300'>
				Для черги <span className='font-semibold'>{queueId}</span> немає
				даних.
			</div>
		);
	}

	const now = new Date();
	const nowMinutes = getNowMinutes();
	const hours = now.getHours().toString().padStart(2, '0');
	const minutes = now.getMinutes().toString().padStart(2, '0');
	const nowLabel = `${hours}:${minutes}`;

	const { activeIndex, nearestIndex } = findActiveAndNearestRange(
		ranges,
		nowMinutes
	);

	const statusText =
		activeIndex !== null
			? `Зараз у проміжку ${ranges[activeIndex].from} – ${ranges[activeIndex].to}`
			: nearestIndex !== null
				? `Найближчий проміжок ${ranges[nearestIndex].from} – ${
						ranges[nearestIndex].to
					}`
				: 'Немає проміжків на сьогодні';

	const upcoming: RangeItem[] = [];
	const past: RangeItem[] = [];

	ranges.forEach((range, index) => {
		//const start = timeToMinutes(range.from);
		const end = timeToMinutes(range.to);
		const isActive = index === activeIndex;

		if (!isActive && end <= nowMinutes) {
			past.push({ range, index });
		} else {
			upcoming.push({ range, index });
		}
	});

	return (
		<div className='rounded-2xl bg-slate-900/70 p-4 shadow-lg'>
			<div className='mb-3 flex items-baseline justify-between gap-2'>
				<h2 className='text-sm font-semibold'>Черга {queueId}</h2>
				<div className='text-xs text-slate-300'>
					Зараз:{' '}
					<span className='font-semibold text-sky-400'>
						{nowLabel}
					</span>
				</div>
			</div>

			<p className='mb-3 text-xs text-slate-300'>{statusText}</p>

			<ul className='space-y-2'>
				{upcoming.map(({ range, index }) => {
					const isActive = index === activeIndex;
					const isNearest = index === nearestIndex;

					const baseClasses =
						'flex items-center justify-between rounded-xl px-3 py-2 text-sm border';
					const variantClasses = isActive
						? 'bg-emerald-500 text-slate-950 border-emerald-400'
						: isNearest
							? 'bg-slate-800 text-slate-50 border-sky-500'
							: 'bg-slate-800 text-slate-100 border-slate-700';

					return (
						<li
							key={`${range.from}-${range.to}-upcoming`}
							className={`${baseClasses} ${variantClasses}`}
						>
							<span className='font-medium'>
								{range.from} – {range.to}
							</span>
							{isActive && (
								<span className='rounded-full bg-slate-950/20 px-2 py-0.5 text-xs font-semibold'>
									зараз
								</span>
							)}
							{!isActive && isNearest && (
								<span className='rounded-full bg-slate-950/20 px-2 py-0.5 text-xs'>
									найближчий
								</span>
							)}
						</li>
					);
				})}
			</ul>

			{past.length > 0 && (
				<div className='mt-4 border-t border-slate-800 pt-3'>
					<p className='mb-2 text-xs text-slate-400'>
						Минулі сьогодні
					</p>
					<ul className='space-y-1'>
						{past.map(({ range }) => (
							<li
								key={`${range.from}-${range.to}-past`}
								className='flex items-center justify-between rounded-xl bg-slate-900 px-3 py-1.5 text-xs text-slate-400'
							>
								<span>
									{range.from} – {range.to}
								</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default TimeList;
