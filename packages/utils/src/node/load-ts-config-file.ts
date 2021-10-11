import { Service } from 'ts-node';
import { interopRequireDefault } from './interop-require-default';

/**
 * 加载 typescript 文件，常用于加载一些配置文件
 *
 * @author yuzhanglong
 * @date 2021-10-10 22:21:31
 */
export const loadTsConfigFile = async <T>(configPath: string): Promise<T> => {
  let tsNodeService: Service;

  // Register TypeScript compiler instance
  try {
    tsNodeService = require('ts-node').register({
      compilerOptions: {
        module: 'CommonJS',
      },
    });
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      throw new Error(
        `'ts-node' is required for the TypeScript configuration files. Make sure it is installed\nError: ${e.message}`,
      );
    }

    throw e;
  }

  tsNodeService.enabled(true);

  // eslint-disable-next-line import/no-dynamic-require
  let configObject = interopRequireDefault(require(configPath)).default;

  // 配置文件是一个函数，调用之
  if (typeof configObject === 'function') {
    configObject = await configObject();
  }

  tsNodeService.enabled(false);

  return configObject;
};
