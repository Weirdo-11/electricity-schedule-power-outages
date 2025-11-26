import { FC } from 'react';

type Props = {
	enabled: boolean;
	onEnable: () => void;
};

const NotificationToggle: FC<Props> = ({ enabled, onEnable }) => {
	if (enabled) {
		return (
			<div className='rounded-2xl bg-slate-900/70 px-4 py-2 text-xs text-emerald-400'>
				Сповіщення за 15 хв до відключення увімкнені (поки вкладка
				відкрита).
			</div>
		);
	}

	return (
		<button
			type='button'
			onClick={onEnable}
			className='rounded-2xl bg-slate-900/70 px-4 py-2 text-xs text-slate-100'
		>
			Увімкнути сповіщення за 15 хв до відключення
		</button>
	);
};

export default NotificationToggle;
