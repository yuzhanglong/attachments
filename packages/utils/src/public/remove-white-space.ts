/**
 * 移除多余的空格
 *
 * @author yuzhanglong
 * @date 2021-11-23 23:17:02
 */
export const removeWhiteSpace = (data: string) => {
  if (!data) {
    return data;
  }

  return data.replace(/\s/g, '');
};
