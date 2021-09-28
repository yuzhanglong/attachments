export interface RemotesEntity {
  name: string;
  url: string;
  sharedLibraries: (string)[];
}

export interface MicroAppConfig {
  name: string;
  deployUrl: string;
  remotes: (RemotesEntity)[];
}

// example
// {
//   "name": "react-demo-app",
//   "deployUrl": "https://react-demo-app-yzl.vercel.app/",
//   "remotes": [
//   {
//     "name": "base_app",
//     "url": "https://base-yzl.vercel.app/base_app_entry.js",
//     "sharedLibraries": [
//       "react",
//       "react-dom",
//       "mobx",
//       "mobx-react-lite",
//       "react-router",
//       "react-router-dom",
//       "antd"
//     ]
//   }
// ]
// }

/**
 * 基于 micro app config 生成目录
 *
 * @author yuzhanglong
 * @date 2021-09-28 00:40:39
 */
export const getModuleFederationRemotes = (microAppConfig: MicroAppConfig) => {
  const remotes: Record<string, string> = {};

  // example: 'base_app': `base_app@https://base-yzl.vercel.app/base_app_entry.js`,
  for (const remote of microAppConfig.remotes) {
    remotes[remote.name] = `${remote.name}@${remote.url}`;
  }
  return remotes;
};

/**
 * 获取 share library 的导入替换回调函数
 *
 * 基座暴露一些公共库，我们称为 share library，我们通过 NormalModuleReplacementPlugin 将所有的公共依赖导向相应的 app
 *
 * @author yuzhanglong
 * @date 2021-09-28 00:47:33
 */
export const getNormalModuleReplacementPluginCallBack = (microAppConfig: MicroAppConfig) => {
  return (v: { request: string }) => {
    const externalRemoteApp = microAppConfig.remotes.find(res => res.sharedLibraries.includes(v.request));
    if (externalRemoteApp) {
      // eslint-disable-next-line no-param-reassign
      v.request = `${externalRemoteApp.name}/${v.request}`;
    }
  };
};

/**
 * 初始化全局 manager 方便调用
 *
 * @author yuzhanglong
 * @date 2021-09-28 00:53:32
 */
export const getMicroAppConfigManager = (microAppConfig: MicroAppConfig) => {
  return {
    getNormalModuleReplacementPluginCallBack: () => getNormalModuleReplacementPluginCallBack(microAppConfig),
    getName: () => microAppConfig.deployUrl,
    getModuleFederationRemotes: () => getModuleFederationRemotes(microAppConfig),
    config: microAppConfig,
  };
};


