import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import { useAudioPlayer } from "expo-audio";
import * as Notifications from "expo-notifications";
import { LargeSecureStore } from "@/lib/large-secure-store";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RUNNING_TIMER_KEY = "DevToolsClock.RunningTimer";
const TIMER_CHANNEL_ID = "timer-alerts-v3";
const TIMER_SOUND = "timer_done.mp3";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export enum TimerType {
  Pomodoro = 'Pomodoro',
  ShortBreak = 'Short Break',
  LongBreak = 'Long Break'
}

type RunningTimer = {
  endsAt: number;
  timerType: TimerType;
  activeTaskId: string | null;
};

type Task = {
  id: string;
  title: string;
  isCompleted: boolean;
  effortCount: number;
  effortSpent: number;
}

interface ClockContextProps {
  tasks: Task[];
  timer: number;
  timerType: TimerType;  
  setTimerTypeWrapper: (timerType: TimerType) => void;
  addTask: (title: string, estimatedEffort?: number) => void;
  removeTask: (id: string) => void;
  clearTasks: () => void;
  
  timerColor: string;  
  startTimer: () => void;
  stopTimer: () => void;
  timerActive: boolean;

  activeTask: Task | null;
  setActiveTask: (task: Task) => void;
}

const ClockContext = createContext<ClockContextProps>({} as ClockContextProps);

export const useClockContext = () => {
  return useContext(ClockContext);
}

interface ClockProviderProps {
  children: React.ReactNode;
}


const largeSecureStore = new LargeSecureStore();

const ClockProvider = (
  { children }: ClockProviderProps
) => {
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [timerType, setTimerType] = useState<TimerType>(TimerType.Pomodoro);
  const [timerColor, setTimerColor] = useState<string>('#BA4949');
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const player = useAudioPlayer(require('@/assets/sound/ringtone-2-133354.mp3'));
  const playerRef = useRef(player);
  playerRef.current = player;
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const timerValueRef = useRef(timer);
  timerValueRef.current = timer;
  const timerTypeRef = useRef(timerType);
  timerTypeRef.current = timerType;
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;
  const activeTaskRef = useRef(activeTask);
  activeTaskRef.current = activeTask;
  const sessionRef = useRef<RunningTimer | null>(null);
  const notificationIdRef = useRef<string | null>(null);
  const finishingRef = useRef(false);
  const tasksHydratedRef = useRef(false);

  useEffect(() => {
    if (!tasksHydratedRef.current) return;
    AsyncStorage.setItem('DevToolsClock.Tasks', JSON.stringify(tasks));
  }, [tasks]);  

  const playSound = () => {
    const current = playerRef.current;
    void current.seekTo(0).then(() => {
      current.play();
    });
  }

  const initialTimer = (timerType: TimerType) => {
    switch(timerType) {
      case TimerType.Pomodoro:
        setTimer(1500);
        setTimerColor('#BA4949');
        break;
      case TimerType.ShortBreak:
        setTimer(300);
        setTimerColor('#38858A');
        break;
      case TimerType.LongBreak:
        setTimer(900);
        setTimerColor('#397097');
        break;
    }    
  }

  useEffect(() => {
    console.log('timerType changed', timerType)    
    switch(timerType) {
      case TimerType.Pomodoro:        
        setTimerColor('#BA4949');
        break;
      case TimerType.ShortBreak:        
        setTimerColor('#38858A');
        break;
      case TimerType.LongBreak:        
        setTimerColor('#397097');
        break;
    }       
  }, [timerType])

  const addTask = (title: string, estimatedEffort: number = 1) => {
    const newTask = {
      id: String(new Date().getTime()),
      title,
      isCompleted: false,
      effortCount: estimatedEffort,
      effortSpent: 0
    }
    setTasks([...tasks, newTask]);
  }

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  }

  const clearTasks = () => {
    setTasks([]);
  }


  const clearTick = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
  };

  const remainingSeconds = (endsAt: number) =>
    Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));

  const cancelAlert = async () => {
    const id = notificationIdRef.current;
    notificationIdRef.current = null;
    if (!id) return;
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch (error) {
      console.error('cancel timer notification', error);
    }
  };

  const scheduleAlert = async (endsAt: number, type: TimerType) => {
    const seconds = Math.round((endsAt - Date.now()) / 1000);
    if (seconds < 1) return;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(TIMER_CHANNEL_ID, {
        name: 'Timer',
        importance: Notifications.AndroidImportance.MAX,
        sound: TIMER_SOUND,
        audioAttributes: {
          usage: Notifications.AndroidAudioUsage.ALARM,
          contentType: Notifications.AndroidAudioContentType.SONIFICATION,
        },
        vibrationPattern: [0, 250, 250, 250],
        enableVibrate: true,
      });
    }

    const permission = await Notifications.requestPermissionsAsync();
    if (permission.status !== 'granted') return;

    notificationIdRef.current = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time is up',
        body: `${type} finished`,
        sound: TIMER_SOUND,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
        channelId: TIMER_CHANNEL_ID,
      },
    });
  };

  const finishSession = async (playInAppSound: boolean) => {
    if (finishingRef.current || !sessionRef.current) return;
    finishingRef.current = true;
    const session = sessionRef.current;
    sessionRef.current = null;
    clearTick();
    setTimerActive(false);
    await cancelAlert();
    await AsyncStorage.removeItem(RUNNING_TIMER_KEY);

    if (playInAppSound) playSound();

    if (session.timerType === TimerType.Pomodoro && session.activeTaskId) {
      setTasks((current) => current.map((task) => (
        task.id === session.activeTaskId
          ? { ...task, effortSpent: task.effortSpent + 1 }
          : task
      )));
    }

    if (session.timerType === TimerType.Pomodoro) {
      setTimerType(TimerType.ShortBreak);
    }
    initialTimer(session.timerType);
    finishingRef.current = false;
  };

  const syncFromClock = async (playSoundIfDue: boolean) => {
    const session = sessionRef.current;
    if (!session || finishingRef.current) return;
    const remaining = remainingSeconds(session.endsAt);
    if (remaining <= 0) {
      if (AppState.currentState !== 'active') return;
      await finishSession(playSoundIfDue);
      return;
    }
    setTimer(remaining);
  };

  const startTicking = () => {
    clearTick();
    void syncFromClock(true);
    timerRef.current = setInterval(() => {
      void syncFromClock(true);
    }, 1000);
  };

  const beginSession = async (session: RunningTimer) => {
    sessionRef.current = session;
    setTimerActive(true);
    setTimer(remainingSeconds(session.endsAt));
    await AsyncStorage.setItem(RUNNING_TIMER_KEY, JSON.stringify(session));
    try {
      await scheduleAlert(session.endsAt, session.timerType);
    } catch (error) {
      console.error('schedule timer notification', error);
    }
    startTicking();
  };

  const startTimer = () => {
    if (sessionRef.current || finishingRef.current) return;
    const seconds = timerValueRef.current;
    if (seconds <= 0) return;
    void beginSession({
      endsAt: Date.now() + seconds * 1000,
      timerType: timerTypeRef.current,
      activeTaskId: activeTaskRef.current?.id ?? null,
    });
  };

  const stopTimer = () => {
    sessionRef.current = null;
    clearTick();
    setTimerActive(false);
    void cancelAlert();
    void AsyncStorage.removeItem(RUNNING_TIMER_KEY);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [tasksRaw, runningRaw] = await Promise.all([
          AsyncStorage.getItem('DevToolsClock.Tasks'),
          AsyncStorage.getItem(RUNNING_TIMER_KEY),
        ]);
        if (cancelled) return;

        const loadedTasks: Task[] = tasksRaw ? JSON.parse(tasksRaw) : [];
        tasksHydratedRef.current = true;
        tasksRef.current = loadedTasks;
        setTasks(loadedTasks);

        if (!runningRaw) return;
        const session = JSON.parse(runningRaw) as RunningTimer;
        if (!session?.endsAt) return;

        setTimerType(session.timerType);
        const task = loadedTasks.find((item) => item.id === session.activeTaskId);
        if (task) setActiveTask(task);

        if (session.endsAt <= Date.now()) {
          sessionRef.current = session;
          await finishSession(false);
          return;
        }

        await Notifications.cancelAllScheduledNotificationsAsync();
        await beginSession(session);
      } catch (error) {
        console.error('restore timer', error);
        tasksHydratedRef.current = true;
      }
    })();

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void syncFromClock(notificationIdRef.current == null);
      }
    });

    return () => {
      cancelled = true;
      subscription.remove();
      clearTick();
    };
  }, []);

  const setTimerTypeWrapper = (t: TimerType) => {
    console.log('setTimerTypeWrapper', t)
    setTimerType(t);
    initialTimer(t);
    console.log('after set', timerType);
  };
  
  return (
    <ClockContext.Provider value={{
      timer, 
      tasks,
      addTask,
      removeTask,
      clearTasks,
      timerType,
      setTimerTypeWrapper,
      timerColor,
      startTimer,
      stopTimer,
      timerActive,
      activeTask,
      setActiveTask
    }}>
      {children}
    </ClockContext.Provider>
  )

}

export default ClockProvider;
