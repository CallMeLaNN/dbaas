type ScheduleHookHandler = (cron: string, callback: () => Promise<void>) => void

export default ScheduleHookHandler
