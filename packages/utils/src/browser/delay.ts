/**
 * 延迟 time 时间
 *
 * @author yuzhanglong
 * @date 2021-11-14 00:52:40
 */
export const delay = (time: number) => {
  return new Promise(resolve => setTimeout(resolve, time));
};
