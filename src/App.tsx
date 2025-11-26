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

const getInitialScheduleState = () => {
	const saved = loadSchedule();
	if (!saved) {
		return {
			schedule: {} as Schedule,
			selectedQueue: null as string | null,
		};
	}
	const firstKey = Object.keys(saved)[0] ?? null;
	return {
		schedule: saved,
		selectedQueue: firstKey,
	};
};

const getInitialNotificationsEnabled = (): boolean => {
	if (!isNotificationSupported()) return false;
	if (!getNotificationsFlag()) return false;
	return Notification.permission === 'granted';
};

const App = () => {
	const initial = getInitialScheduleState();

	const [rawText, setRawText] = useState('');
	const [schedule, setSchedule] = useState<Schedule>(initial.schedule);
	const [selectedQueue, setSelectedQueue] = useState<string | null>(
		initial.selectedQueue
	);
	const [notificationsEnabled, setNotificationsEnabled] = useState(
		getInitialNotificationsEnabled
	);

	const queues = useMemo(
		() => Object.keys(schedule).sort((a, b) => a.localeCompare(b, 'uk')),
		[schedule]
	);

	const currentRanges = useMemo(() => {
		if (!selectedQueue) return [];
		return schedule[selectedQueue] ?? [];
	}, [schedule, selectedQueue]);

	const handleSaveSchedule = () => {
		if (!rawText.trim()) return;
		const parsed = parseSchedule(rawText);
		setSchedule(parsed);
		saveSchedule(parsed);
		const firstKey = Object.keys(parsed)[0] ?? null;
		setSelectedQueue(firstKey);
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
			const ranges = schedule[selectedQueue];
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
	}, [notificationsEnabled, schedule, selectedQueue]);

	return (
		<div className='flex min-h-screen justify-center bg-slate-950 px-3 py-4 text-slate-50'>
			<main className='flex w-full max-w-md flex-col gap-3'>
				<InputForm
					value={rawText}
					onChange={setRawText}
					onParse={handleSaveSchedule}
				/>
				<QueueSelector
					queues={queues}
					selected={selectedQueue}
					onSelect={setSelectedQueue}
				/>
				<NotificationToggle
					enabled={notificationsEnabled}
					onEnable={handleEnableNotifications}
				/>
				<TimeList queueId={selectedQueue} ranges={currentRanges} />
			</main>
		</div>
	);
};

export default App;
