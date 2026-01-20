import { FC } from 'react';

type Props = {
	without: string;
	withValue: string;
};

const QueueStats: FC<Props> = ({ without, withValue }) => {
	return (
		<div className='rounded-2xl bg-slate-900/70 p-4 shadow-lg'>
			<h2 className='mb-2 text-sm font-semibold'>Підрахунок на добу</h2>

			<div className='grid grid-cols-2 gap-3'>
				<div>
					<label className='mb-1 block text-xs text-slate-300'>
						Без світла (год)
					</label>
					<input
						readOnly
						value={without}
						className='w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none'
					/>
				</div>

				<div>
					<label className='mb-1 block text-xs text-slate-300'>
						Зі світлом (год)
					</label>
					<input
						readOnly
						value={withValue}
						className='w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none'
					/>
				</div>
			</div>
		</div>
	);
};

export default QueueStats;
