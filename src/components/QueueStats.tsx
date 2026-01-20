import { FC } from 'react';

type Props = {
	without: string;
	withValue: string;
};

const QueueStats: FC<Props> = ({ without, withValue }) => {
	return (
		<div className='rounded-2xl bg-slate-900/70 p-4 shadow-lg'>
			<div className='grid grid-cols-2 gap-3 text-xs'>
				<div className='flex gap-3 justify-start items-center'>
					<span className='text-slate-400'>Без світла (год)</span>
					<span className='text-red-600'>{without}</span>
				</div>
				<div className='flex gap-3 justify-start items-center'>
					<span className='text-slate-400'>Зі світлом (год)</span>
					<span className='text-green-400'>{withValue}</span>
				</div>
			</div>
		</div>
	);
};

export default QueueStats;
