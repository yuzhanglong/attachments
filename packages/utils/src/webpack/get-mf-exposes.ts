/**
 * 基于 webpack module federation 配置 Exposes
 *
 * @author yuzhanglong
 * @date 2021-08-29 13:29:33
 * @param baseUrl 根路径
 * @param externalPaths 需要共享模块的路径
 */

export function getMfExposes(externalPaths: string[], baseUrl?: string) {
  const data = {};
  let base;
  base = baseUrl || './';
  if (!baseUrl.endsWith('/')) {
    base += '/';
  }
}
