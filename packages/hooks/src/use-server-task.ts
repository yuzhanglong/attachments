/**
 * 服务端进度查询 hooks
 *
 * @author yuzhanglong
 * @date 2021-08-13 22:43:22
 */

import { useEffect, useRef, useState } from 'react';

// 轮询间隔，单位为毫秒
const DEFAULT_REQUEST_TIME_GAP = 2000;

// 状态枚举
export enum ServerTaskStatus {
  // 等待态
  WAITING,
  // 运行态
  RUNNING,
  // 完成态
  SUCCESS,
  // 错误态
  FAILED
}

interface ServerTaskReturnWithFormat {
  // 任务状态
  status: ServerTaskStatus;
  // 百分比
  percent: number;
  // 附加消息
  message: string;

  // 其它参数
  [key: string]: any;
}

interface ServerTaskOptions<P = any, R = any> {
  // 格式化响应体回调
  formatResult?: (data: R) => ServerTaskReturnWithFormat;

  // 轮询的时间间隔
  timeGap?: number;

  // 成功回调
  successCallback?: (res: ServerTaskReturnWithFormat) => void;

  // 失败回调
  errorCallback?: (res: any, e?: Error) => void;

  // 请求参数
  requestParams?: P;
}

export function useServerTask<P, R>(
  service: (params: P) => Promise<R>,
  options: ServerTaskOptions<P, R>,
) {
  // 当前状态
  const [currentStatus, setCurrentStatus] = useState<ServerTaskStatus>(
    ServerTaskStatus.WAITING,
  );

  // 百分比
  const [percentage, setPercentage] = useState<number>(0);

  const {
    formatResult,
    successCallback,
    errorCallback,
    requestParams,
  } = options;

  const { current } = useRef<{
    taskTimer: number | null;
  }>({
    taskTimer: null,
  });

  // 清除计时器
  const clearTaskTimer = () => {
    if (current.taskTimer) {
      clearTimeout(current.taskTimer);
      current.taskTimer = null;
    }
  };

  useEffect(() => {
    // 销毁 timer
    return () => {
      clearTaskTimer();
    };
  }, []);


  // 重置任务状态，我们会做两件事：清空定时器，将状态设置为等待态
  const resetTaskStatus = () => {
    clearTaskTimer();
    setCurrentStatus(ServerTaskStatus.WAITING);
  };

  // 更新任务状态
  const refreshTaskStatus = async (params: P) => {
    try {
      // 执行请求
      const response = await service({
        ...requestParams,
        ...params,
      });

      // 对返回的数据进行 format(如果有的话)
      const formattedResponse = (formatResult
        ? formatResult(response)
        : response) as ServerTaskReturnWithFormat;

      const { status, percent } = formattedResponse;

      setPercentage(percent);
      setCurrentStatus(status);

      const isSuccess = status === ServerTaskStatus.SUCCESS;

      // 如果服务端是运行态，我们继续递归轮询检测
      if (isSuccess) {
        setCurrentStatus(ServerTaskStatus.SUCCESS);
        // 当任务完成时，执行相关回调
        if (successCallback) {
          successCallback(formattedResponse);
        }
      } else {
        // 错误态
        if (errorCallback) {
          errorCallback(formattedResponse);
        }
        setCurrentStatus(ServerTaskStatus.FAILED);
      }
    } catch (e) {
      // 错误态
      setCurrentStatus(ServerTaskStatus.FAILED);
      if (errorCallback) {
        errorCallback(formatResult, e);
      }
    }
  };

  // 执行任务
  const executeTask = (params: P) => {
    // 可能的任何状态 -- 等待态
    resetTaskStatus();

    // 等待态 -- 运行态
    setCurrentStatus(ServerTaskStatus.RUNNING);

    // 更新状态
    current.taskTimer = window.setInterval(() => {
      refreshTaskStatus(params);
    }, options.timeGap || (DEFAULT_REQUEST_TIME_GAP as any));
  };



  return {
    executeTask,
    currentStatus,
    percentage,
  };
}
