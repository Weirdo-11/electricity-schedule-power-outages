import { FC } from 'react';

type Props = {
	queues: string[];
	selected: string | null;
	onSelect: (queue: string) => void;
};

const QueueSelector: FC<Props> = ({ queues, selected, onSelect }) => {
	if (!queues.length) {
		return (
			<div className='rounded-2xl bg-slate-900/70 p-4 text-sm text-slate-300'>
				Немає збережених черг. Встав текст вище й натисни «Зберегти
				графік».
			</div>
		);
	}

	return (
		<div className='mb-4 rounded-2xl bg-slate-900/70 p-4 shadow-lg'>
			<h2 className='mb-2 text-sm font-semibold'>Обери свою чергу</h2>
			<div className='flex flex-wrap gap-2'>
				{queues.map((queue) => (
					<button
						key={queue}
						onClick={() => onSelect(queue)}
						className={`rounded-xl px-3 py-1.5 text-sm ${
							selected === queue
								? 'bg-sky-500 text-slate-950'
								: 'bg-slate-800 text-slate-100'
						}`}
					>
						{queue}
					</button>
				))}
			</div>
		</div>
	);
};

export default QueueSelector;
