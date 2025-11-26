import { FC } from 'react';

type Props = {
	value: string;
	onChange: (value: string) => void;
	onParse: () => void;
};

const InputForm: FC<Props> = ({ value, onChange, onParse }) => {
	return (
		<div className='mb-4 rounded-2xl bg-slate-900/70 p-4 shadow-lg'>
			<h1 className='mb-3 text-lg font-semibold'>Графік відключень</h1>
			<p className='mb-2 text-xs text-slate-300'>
				Встав сюди текст з оголошення (Telegram, сайт облeнерго тощо).
			</p>
			<textarea
				className='h-48 w-full resize-none rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-sm outline-none focus:border-sky-500'
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder='Встав повний текст з графіком…'
			/>
			<button
				className='mt-3 w-full rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 active:scale-[0.98]'
				onClick={onParse}
			>
				Зберегти графік
			</button>
		</div>
	);
};

export default InputForm;
