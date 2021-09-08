/**
 * File: create-scheduler.ts
 * Description: 定时调度器工具函数
 * Created: 2021-09-05 21:06:44
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

export const createScheduler = () => {
  // 任务 id
  let taskId: number | undefined;

  // 执行调度的回调函数
  let callback: () => any | undefined;

  // 即将调度的时间
  let scheduleTime = -Infinity;

  const getCurrentTime = () => {
    return performance.now();
  };

  const clearCurrentScheduleTimer = () => {
    window.clearTimeout(taskId);
  };

  const resetScheduler = (newScheduleTime: number) => {
    if (!callback) {
      return;
    }

    // 新配置的时间早于即将调度的时间，不处理
    if (newScheduleTime < scheduleTime) {
      return;
    }

    clearCurrentScheduleTimer();
    taskId = window.setTimeout(
      callback,
      newScheduleTime - getCurrentTime(),
    );

    scheduleTime = newScheduleTime;
  };

  const startSchedule = (cb: () => void, time: number) => {
    callback = cb;
    resetScheduler(time);
  };

  const stopSchedule = () => {
    clearCurrentScheduleTimer();
    callback = undefined;
  };

  return {
    resetScheduler,
    startSchedule,
    stopSchedule,
  };
};
