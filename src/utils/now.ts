import { queueScheduler, SchedulerLike } from 'rxjs';

export const schedulerNow = (scheduler?: SchedulerLike) => (scheduler || queueScheduler).now();
