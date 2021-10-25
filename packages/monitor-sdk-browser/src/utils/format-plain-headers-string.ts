/**
 * 格式化 headers 字符串，返回一个对象
 *
 * @author yuzhanglong
 * @date 2021-08-24 00:26:43
 */
export const formatPlainHeadersString = (headerStr: string) => {
  const headers = headerStr.trim().split(/[\r\n]+/);

  const headerMap = {};
  for (let i = 0; i < headers.length; i += 1) {
    const line = headers[i];
    const parts = line.split(': ');
    const header = parts.shift();
    headerMap[header] = parts.join(': ');
  }
  return headerMap;
};
