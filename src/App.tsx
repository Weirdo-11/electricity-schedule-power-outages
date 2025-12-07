import { useEffect, useMemo, useState } from 'react';
import InputForm from './components/InputForm';
import QueueSelector from './components/QueueSelector';
import TimeList from './components/TimeList';
import NotificationToggle from './components/NotificationToggle';
import { Schedule } from './shared/types';
import { parseSchedule } from './shared/parseSchedule';
import { loadSchedule, saveSchedule } from './shared/localStorage';
import { getNowMinutes, timeToMinutes } from './shared/time';
import {
	isNotificationSupported,
	requestNotificationPermission,
	sendNotification,
} from './shared/notifications';
import {
	makeRangeKey,
	markRangeNotified,
	wasRangeNotified,
	getNotificationsFlag,
	setNotificationsFlag,
} from './shared/notificationStore';

const getInitialScheduleState = (): Schedule => {
	const saved = loadSchedule();
	if (!saved) {
		return {
			ranges: {} as Schedule['ranges'],
			selectedRange: null as string | null,
		};
	}
	const firstKey =
		saved?.selectedRange ?? Object.keys(saved.ranges || {})[0] ?? null;
	return {
		ranges: saved?.ranges,
		selectedRange: firstKey,
	};
};

const getInitialNotificationsEnabled = (): boolean => {
	if (!isNotificationSupported()) return false;
	if (!getNotificationsFlag()) return false;
	return Notification.permission === 'granted';
};

const App = () => {
	const initial = getInitialScheduleState();

	const [displaySelectMenu, setDisplaySelectMenu] = useState<boolean>(false);

	const [rawText, setRawText] = useState('');
	const [schedule, setSchedule] = useState<Schedule>(initial);
	const [selectedQueue, setSelectedQueue] = useState<string | null>(
		initial?.selectedRange || null
	);
	const [notificationsEnabled, setNotificationsEnabled] = useState(
		getInitialNotificationsEnabled
	);

	const onSelectQueue = (key: string) => {
		setSelectedQueue(key);
		saveSchedule({ ...schedule, selectedRange: key });
	};

	const queues = useMemo(
		() =>
			Object.keys(schedule?.ranges || {}).sort((a, b) =>
				a.localeCompare(b, 'uk')
			),
		[schedule?.ranges]
	);

	const currentRanges = useMemo(() => {
		if (!selectedQueue) return [];
		return schedule?.ranges?.[selectedQueue] ?? [];
	}, [schedule?.ranges, selectedQueue]);

	const handleSaveSchedule = () => {
		if (!rawText.trim()) return;
		const parsed = parseSchedule(rawText);
		const firstKey = Object.keys(parsed)[0] ?? null;
		setSchedule({ ranges: parsed, selectedRange: firstKey });
		saveSchedule({ ranges: parsed, selectedRange: firstKey });
		setSelectedQueue(firstKey);
		setDisplaySelectMenu(false);
	};

	const handleEnableNotifications = async () => {
		if (!isNotificationSupported()) {
			alert('Браузер не підтримує сповіщення');
			return;
		}
		const permission = await requestNotificationPermission();
		if (permission === 'granted') {
			setNotificationsEnabled(true);
			setNotificationsFlag(true);
		}
	};

	useEffect(() => {
		if (!notificationsEnabled) return;

		const checkAndNotify = () => {
			if (!selectedQueue) return;
			const ranges = schedule?.ranges?.[selectedQueue];
			if (!ranges || !ranges.length) return;

			const now = new Date();
			const todayKey = now.toISOString().slice(0, 10);
			const nowMinutes = getNowMinutes();

			for (const range of ranges) {
				const start = timeToMinutes(range.from);
				if (start <= nowMinutes) {
					continue;
				}

				const diff = start - nowMinutes;
				if (diff !== 15) {
					continue;
				}

				const key = makeRangeKey(todayKey, selectedQueue, range.from);
				if (wasRangeNotified(key)) {
					continue;
				}

				sendNotification('Відключення світла за 15 хв', {
					body: `Черга ${selectedQueue}: ${range.from} – ${range.to}`,
					tag: key,
				});

				markRangeNotified(key);
				break;
			}
		};

		checkAndNotify();
		const id = window.setInterval(checkAndNotify, 60_000);

		return () => {
			window.clearInterval(id);
		};
	}, [notificationsEnabled, schedule?.ranges, selectedQueue]);

	return (
		<div className='flex min-h-screen justify-center bg-slate-950 px-3 py-4 text-slate-50'>
			<main className='flex w-full max-w-md flex-col gap-3'>
				<TimeList queueId={selectedQueue} ranges={currentRanges} />
				<NotificationToggle
					enabled={notificationsEnabled}
					onEnable={handleEnableNotifications}
				/>
				<QueueSelector
					queues={queues}
					selected={selectedQueue}
					onSelect={onSelectQueue}
				/>
				{displaySelectMenu ? (
					<InputForm
						value={rawText}
						onChange={setRawText}
						onParse={handleSaveSchedule}
					/>
				) : (
					<button
						className='mt-3 w-full rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 active:scale-[0.98]'
						onClick={() => setDisplaySelectMenu(true)}
					>
						Оновити графік
					</button>
				)}
			</main>
		</div>
	);
};

export default App;
